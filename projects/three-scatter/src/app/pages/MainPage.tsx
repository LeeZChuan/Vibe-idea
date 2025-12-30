import { MainLayout } from '../layout/MainLayout'
import { RightPanel } from '../layout/RightPanel'
import { ScatterCanvasWithStore } from '../../features/scatter3d/ScatterCanvas'
import { CompanyTable } from '../../features/scatter3d/components/CompanyTable'
import { InteractionHint } from '../../features/scatter3d/components/InteractionHint'
import styles from '../app.module.css'

export function MainPage() {
  return (
    <MainLayout
      left={<CompanyTable />}
      center={<ScatterCanvasWithStore />}
      right={
        <div className={styles.rightWrap}>
          <RightPanel />
          <InteractionHint />
        </div>
      }
    />
  )
}


