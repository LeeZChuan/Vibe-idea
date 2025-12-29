import { MainLayout } from './layout/MainLayout'
import { RightPanel } from './layout/RightPanel'
import { ScatterCanvas } from '../features/scatter3d/ScatterCanvas'
import { InteractionHint } from '../features/scatter3d/components/InteractionHint'
import styles from './app.module.css'

export default function App() {
  return (
    <MainLayout
      left={<ScatterCanvas />}
      right={
        <div className={styles.rightWrap}>
          <RightPanel />
          <InteractionHint />
        </div>
      }
    />
  )
}


