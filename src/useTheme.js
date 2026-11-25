import { useEffect } from 'react'
import useStoredState from './useStoredState'

// 'system' sigue la preferencia del sistema; 'light' / 'dark' la fuerzan.
export default function useTheme() {
  const [theme, setTheme] = useStoredState('theme', 'system')
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
  }, [theme])
  return [theme, setTheme]
}
