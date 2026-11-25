import { useEffect, useState } from 'react'

// Estado que se guarda en el navegador de cada persona (checklist, video activado, última variante).
const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export default function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback))
  useEffect(() => {
    setValue(read(key, fallback))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const set = (next) => {
    setValue((prev) => {
      const v = typeof next === 'function' ? next(prev) : next
      try {
        localStorage.setItem(key, JSON.stringify(v))
      } catch {
        /* sin almacenamiento: sigue funcionando sin recordar */
      }
      return v
    })
  }
  return [value, set]
}
