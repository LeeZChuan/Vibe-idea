import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Build unified data.json from:
 * - header.json (metrics + report periods)
 * - 1.json ~ 5.json (stockItemsValue)
 *
 * Output:
 * - data.json (stable JSON, 2-space indent)
 *
 * Notes:
 * - company key: marketCode
 * - missing value: explicitly null
 * - duplicates: last-write-wins + warnings recorded
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_FILES = ['header.json', '1.json', '2.json', '3.json', '4.json', '5.json']
const DEFAULT_OUT_FILE = 'data.json'

/** @returns {Promise<any>} */
async function readJson(absPath) {
  const txt = await fs.readFile(absPath, 'utf8')
  return JSON.parse(txt)
}

function isNonEmptyString(x) {
  return typeof x === 'string' && x.trim().length > 0
}

function toNumberOrNull(input) {
  if (input === null || input === undefined) return null
  const n = typeof input === 'number' ? input : Number(input)
  return Number.isFinite(n) ? n : null
}

function cmpDateDesc(a, b) {
  // reportDate format is YYYY-MM-DD, string compare works
  return b.localeCompare(a)
}

async function main() {
  const outPathArg = process.argv[2]
  const outAbsPath = outPathArg ? path.resolve(process.cwd(), outPathArg) : path.join(__dirname, DEFAULT_OUT_FILE)

  const absInputs = INPUT_FILES.map((f) => path.join(__dirname, f))
  const warnings = []

  // --- header.json ---
  const headerAbs = absInputs[0]
  const headerRaw = await readJson(headerAbs)

  // header.json 的结构在不同导出里可能有 1~2 层 items 嵌套，这里做兼容探测
  const headerCandidates = [
    headerRaw?.data?.items?.items,
    headerRaw?.data?.items,
    headerRaw?.data?.items?.items?.items,
  ].filter(Boolean)

  const headerPayload =
    headerCandidates.find((c) => Array.isArray(c?.items) && Array.isArray(c?.reportColumns)) ??
    headerCandidates.find((c) => Array.isArray(c?.items) || Array.isArray(c?.reportColumns)) ??
    null

  if (!headerPayload) {
    throw new Error('[buildDataJson] invalid header.json structure: cannot find items/reportColumns')
  }

  const headerStart = headerPayload?.startReportDate ?? null
  const headerEnd = headerPayload?.endReportDate ?? null

  /** @type {Record<string, any>} */
  const metrics = {}
  /** @type {string[]} */
  const metricOrder = []

  const headerMetricItems = Array.isArray(headerPayload?.items) ? headerPayload.items : []
  for (const it of headerMetricItems) {
    const property = it?.property
    if (!isNonEmptyString(property)) continue
    const label = it?.name ?? it?.itemName ?? property
    metrics[property] = {
      label,
      itemName: isNonEmptyString(it?.itemName) ? it.itemName : undefined,
      name: isNonEmptyString(it?.name) ? it.name : undefined,
      yoy: typeof it?.yoy === 'boolean' ? it.yoy : undefined,
      itemType: typeof it?.itemType === 'number' ? it.itemType : undefined,
      bold: typeof it?.bold === 'boolean' ? it.bold : undefined,
      indentation: typeof it?.indentation === 'number' ? it.indentation : undefined,
    }
    metricOrder.push(property)
  }

  /** @type {Array<{reportDate: string, reportType: string}>} */
  let reportPeriods = Array.isArray(headerPayload?.reportColumns)
    ? headerPayload.reportColumns
        .filter((c) => isNonEmptyString(c?.reportDate))
        .map((c) => ({ reportDate: c.reportDate, reportType: String(c?.reportType ?? 'UNKNOWN') }))
    : []

  // sort & dedupe reportPeriods (by reportDate)
  {
    const map = new Map()
    for (const p of reportPeriods) {
      if (!map.has(p.reportDate)) map.set(p.reportDate, p)
    }
    reportPeriods = Array.from(map.values()).sort((a, b) => cmpDateDesc(a.reportDate, b.reportDate))
  }

  // --- data files 1~5.json ---
  /** @type {Map<string, any>} */
  const companiesByMarketCode = new Map()
  /** @type {Set<string>} */
  const seenReportDates = new Set(reportPeriods.map((p) => p.reportDate))
  /** @type {Set<string>} */
  const seenProperties = new Set(metricOrder)

  for (let i = 1; i < absInputs.length; i++) {
    const abs = absInputs[i]
    const fileName = path.basename(abs)
    const raw = await readJson(abs)
    const list = Array.isArray(raw?.data?.stockItemsValue) ? raw.data.stockItemsValue : []

    for (const s of list) {
      const marketCode = s?.marketCode
      if (!isNonEmptyString(marketCode)) {
        warnings.push({ type: 'missing_marketCode', source: fileName, code: s?.code ?? null, market: s?.market ?? null })
        continue
      }

      let company = companiesByMarketCode.get(marketCode)
      if (!company) {
        company = {
          marketCode,
          market: s?.market ?? null,
          code: s?.code ?? null,
          name: s?.name ?? null,
          board: s?.board ?? null,
          stkId: typeof s?.stkId === 'number' ? s.stkId : null,
          values: {}, // reportDate -> property -> number|null
        }
        companiesByMarketCode.set(marketCode, company)
      } else {
        // detect inconsistent company info across files
        const fields = ['market', 'code', 'name', 'board']
        for (const f of fields) {
          const prev = company[f]
          const next = s?.[f] ?? null
          if (prev !== null && next !== null && prev !== next) {
            warnings.push({ type: 'company_info_conflict', marketCode, field: f, prev, next, source: fileName })
          }
          if (prev === null && next !== null) company[f] = next
        }
        if (company.stkId === null && typeof s?.stkId === 'number') company.stkId = s.stkId
      }

      const itemColumns = Array.isArray(s?.itemColumns) ? s.itemColumns : []
      for (const col of itemColumns) {
        const property = col?.item?.property
        if (!isNonEmptyString(property)) continue
        seenProperties.add(property)
        if (!metrics[property]) {
          metrics[property] = { label: property }
          metricOrder.push(property)
          warnings.push({ type: 'metric_missing_in_header', property, source: fileName })
        }

        const vals = Array.isArray(col?.values) ? col.values : []
        for (const v of vals) {
          const reportDate = v?.reportDate
          if (!isNonEmptyString(reportDate)) continue
          seenReportDates.add(reportDate)

          const numOrNull = toNumberOrNull(v?.value)
          if (v?.value !== null && v?.value !== undefined && numOrNull === null) {
            warnings.push({ type: 'invalid_number', marketCode, reportDate, property, rawValue: v.value, source: fileName })
          }

          if (!company.values[reportDate]) company.values[reportDate] = {}
          const prevHad = Object.prototype.hasOwnProperty.call(company.values[reportDate], property)
          if (prevHad) {
            warnings.push({ type: 'duplicate_value_overwrite', marketCode, reportDate, property, source: fileName })
          }
          company.values[reportDate][property] = numOrNull
        }
      }
    }
  }

  // merge reportPeriods with any extra reportDates found in data
  const reportDateSet = new Set(reportPeriods.map((p) => p.reportDate))
  for (const d of seenReportDates) {
    if (!reportDateSet.has(d)) {
      reportPeriods.push({ reportDate: d, reportType: 'UNKNOWN' })
      reportDateSet.add(d)
      warnings.push({ type: 'reportDate_missing_in_header', reportDate: d })
    }
  }
  reportPeriods.sort((a, b) => cmpDateDesc(a.reportDate, b.reportDate))

  // ensure every company has every reportDate entry
  for (const company of companiesByMarketCode.values()) {
    for (const p of reportPeriods) {
      if (!company.values[p.reportDate]) company.values[p.reportDate] = {}
    }
  }

  // fill missing properties with explicit null
  for (const company of companiesByMarketCode.values()) {
    for (const p of reportPeriods) {
      const cell = company.values[p.reportDate]
      for (const prop of metricOrder) {
        if (!Object.prototype.hasOwnProperty.call(cell, prop)) cell[prop] = null
      }
    }
  }

  // stable companies array
  const companies = Array.from(companiesByMarketCode.values()).sort((a, b) => String(a.marketCode).localeCompare(String(b.marketCode)))

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      startReportDate: headerStart,
      endReportDate: headerEnd,
      sources: INPUT_FILES,
      counts: {
        companies: companies.length,
        reportPeriods: reportPeriods.length,
        metrics: metricOrder.length,
      },
      warnings,
    },
    reportPeriods,
    metricOrder,
    metrics,
    companies,
  }

  await fs.writeFile(outAbsPath, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`[buildDataJson] wrote: ${outAbsPath}`)
  console.log(`[buildDataJson] companies=${companies.length}, periods=${reportPeriods.length}, metrics=${metricOrder.length}, warnings=${warnings.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


