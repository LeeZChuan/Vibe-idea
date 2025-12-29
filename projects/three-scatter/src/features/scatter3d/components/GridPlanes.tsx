import { Grid } from '@react-three/drei'
import { THEME } from '../../../theme/theme'

export function GridPlanes(props: { size?: number }) {
  const size = props.size ?? 20
  return (
    <group>
      <Grid
        args={[size, size]}
        cellSize={1}
        cellThickness={0.6}
        cellColor={THEME.colors.axisX}
        sectionSize={5}
        sectionThickness={1}
        sectionColor={THEME.colors.axisTick}
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />
    </group>
  )
}


