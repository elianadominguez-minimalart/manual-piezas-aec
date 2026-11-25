import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RULES, TOP, VARIANTS } from '../data'
import { DUR, EASE_OUT, SPRING, collapse } from '../motion'
import { AutoIcon, BookIcon, CloseIcon, MoonIcon, SunIcon } from './Icons'

const THEMES = [
  ['system', 'Automático', AutoIcon],
  ['light', 'Claro', SunIcon],
  ['dark', 'Oscuro', MoonIcon],
]

function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="inline-flex rounded-full border border-line/70 bg-surface/60 p-[3px]" role="radiogroup" aria-label="Tema">
      {THEMES.map(([k, label, Icon]) => {
        const on = theme === k
        return (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={on}
            title={label}
            onClick={() => setTheme(k)}
            className={`relative grid size-8 cursor-pointer place-items-center rounded-full transition-colors duration-200 ${on ? 'text-blue' : 'text-muted hover:text-fg'}`}
          >
            {on && <motion.span layoutId="theme-pill" transition={SPRING.snappy} className="soft absolute inset-0 rounded-full bg-surface" />}
            <motion.span
              key={on ? `${k}-on` : k}
              initial={on ? { rotate: -40, scale: 0.6 } : false}
              animate={{ rotate: 0, scale: 1 }}
              transition={SPRING.pop}
              className="relative"
            >
              <Icon className="size-4" />
            </motion.span>
            <span className="sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function RulesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        aria-expanded={open}
        aria-controls="rules-panel"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-[38px] cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-200 ${
          open ? 'soft border-blue/30 bg-surface text-blue' : 'border-line/70 bg-surface/60 text-fg hover:bg-surface'
        }`}
      >
        <BookIcon className="size-4" />
        <span className="hidden xl:inline">Reglas generales</span>
        <span className="xl:hidden">Reglas</span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="rules-panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: DUR.base, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: DUR.fast } }}
            style={{ transformOrigin: 'top right' }}
            className="soft-lg absolute right-0 z-30 mt-2.5 w-[min(92vw,420px)] rounded-2xl border border-line bg-surface p-5 text-fg"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="m-0 font-display text-base font-semibold">Reglas para todas las piezas</p>
              <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-sunk hover:text-fg" aria-label="Cerrar">
                <CloseIcon className="size-4" />
              </button>
            </div>
            <motion.dl initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }} className="m-0 grid gap-3 text-[13.5px]">
              {RULES.short.map(([k, v]) => (
                <motion.div
                  key={k}
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } } }}
                  className="rounded-xl bg-sunk px-3 py-2.5"
                >
                  <dt className="text-[11px] font-semibold tracking-wider text-blue uppercase">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </motion.div>
              ))}
            </motion.dl>
            <details className="mt-4 text-[13.5px]">
              <summary className="cursor-pointer font-medium text-blue">Ver el detalle</summary>
              <ul className="mt-2 mb-0 list-disc space-y-1 pl-4.5 text-muted">
                {RULES.all.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TopBar({ ctx, onPick, theme, setTheme }) {
  const isMic = ctx.startsWith('mic')
  const ref = useRef(null)

  // Altura real de la barra, para que la vista previa y los saltos queden debajo
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--bar-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.header
      ref={ref}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DUR.slow, ease: EASE_OUT }}
      className="glass sticky top-0 z-20 border-b border-glass-line pt-[env(safe-area-inset-top)] shadow-[0_10px_30px_rgba(16,32,60,.07)]"
    >
      <div className="mx-auto grid max-w-[1360px] grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#home" onClick={(e) => (e.preventDefault(), onPick('home'))} className="group flex items-center gap-3 justify-self-start text-fg no-underline">
          <motion.img
            whileHover={{ rotate: -4, scale: 1.04 }}
            transition={SPRING.pop}
            src="./logo-arcor-en-casa.webp"
            alt="Arcor en Casa"
            width="84"
            height="44"
            className="block h-11 w-auto"
          />
          <span className="hidden border-l border-line pl-3 font-display text-[14px] leading-tight font-semibold xl:block">
            Manual
            <br />
            de piezas
          </span>
        </a>

        <nav
          aria-label="Secciones"
          className="no-scrollbar order-3 col-span-2 -mx-4 flex gap-1 overflow-x-auto px-4 lg:order-none lg:col-span-1 lg:mx-0 lg:justify-self-center lg:overflow-visible lg:px-0"
        >
          <div className="flex gap-1 rounded-full border border-line/70 bg-surface/60 p-1">
            {TOP.map(([k, label]) => {
              const on = k === ctx || (k === 'mic' && isMic)
              return (
                <motion.button
                  key={k}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  aria-current={on ? 'page' : undefined}
                  onClick={() => onPick(k)}
                  className={`relative shrink-0 cursor-pointer rounded-full px-4 py-[7px] text-[14px] font-semibold whitespace-nowrap transition-colors duration-200 ${
                    on ? 'text-white' : 'text-muted hover:text-fg'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={SPRING.snappy}
                      className="absolute inset-0 rounded-full bg-blue shadow-[0_4px_14px_rgba(0,113,209,.35)]"
                    />
                  )}
                  <span className="relative">{label}</span>
                </motion.button>
              )
            })}
          </div>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <RulesMenu />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMic && (
          <motion.div key="variants" {...collapse} className="overflow-hidden border-t border-glass-line">
            <div
              className="no-scrollbar mx-auto flex max-w-[1360px] items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:justify-center"
              role="group"
              aria-label="Variante de micrositio"
            >
              {VARIANTS.map(([k, label, hint], i) => {
                const on = k === ctx
                return (
                  <motion.button
                    key={k}
                    type="button"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.05, duration: DUR.base, ease: EASE_OUT } }}
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={on}
                    onClick={() => onPick(k)}
                    className="relative flex shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl py-1 pr-3.5 pl-1 text-left"
                  >
                    {on && <motion.span layoutId="variant-pill" transition={SPRING.snappy} className="soft absolute inset-0 rounded-2xl border border-blue/40 bg-surface" />}
                    <img src={`./img/${k}-d.webp`} alt="" className="relative block h-8 w-12 rounded-xl object-cover object-top" />
                    <span className="relative leading-tight">
                      <b className={`block text-[13px] transition-colors duration-200 ${on ? 'text-blue' : ''}`}>{label}</b>
                      <small className="block text-[11.5px] text-muted">{hint}</small>
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
