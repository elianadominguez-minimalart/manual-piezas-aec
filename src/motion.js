// Tokens de animación compartidos: mismas curvas y tiempos en toda la web.

// Salida suave (rápido al principio, frena al final): para entradas y cambios de estado
export const EASE_OUT = [0.22, 1, 0.36, 1]
// Entrada-salida: para cosas que se mueven de un lugar a otro sin resorte
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

export const DUR = { fast: 0.16, base: 0.24, slow: 0.4 }

// Resortes: "snappy" para indicadores que se deslizan, "soft" para objetos más grandes
export const SPRING = {
  snappy: { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 },
  soft: { type: 'spring', stiffness: 260, damping: 30 },
  pop: { type: 'spring', stiffness: 600, damping: 18 },
}

// Entrada escalonada de listas
export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
}
export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
}

// Despliegue de alto automático (tarjetas que se abren, sublistas)
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { height: { duration: DUR.slow, ease: EASE_OUT }, opacity: { duration: DUR.base, delay: 0.05 } } },
  exit: { height: 0, opacity: 0, transition: { height: { duration: DUR.base, ease: EASE_IN_OUT }, opacity: { duration: DUR.fast } } },
}
