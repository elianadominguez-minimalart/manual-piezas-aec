import { motion } from 'motion/react'
import { DUR, EASE_OUT } from '../motion'
import { DesktopIcon } from './Icons'

// Por ahora el manual es solo para escritorio: debajo de 1024 px se tapa con este aviso.
export default function DesktopOnly() {
  return (
    <div
      className="glass fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-[max(16px,env(safe-area-inset-top))_max(16px,env(safe-area-inset-right))_max(16px,env(safe-area-inset-bottom))_max(16px,env(safe-area-inset-left))] lg:hidden"
      role="alert"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE_OUT }}
        className="soft-lg flex w-full max-w-sm min-w-0 flex-col items-center gap-3 rounded-3xl border border-glass-line bg-surface px-5 py-6 text-center sm:gap-4 sm:px-7 sm:py-8"
      >
        <img src="./logo-arcor-en-casa.webp" alt="Arcor en Casa" width="92" height="48" className="h-10 w-auto sm:h-12" />
        <span className="grid size-12 place-items-center rounded-2xl bg-blue-soft text-blue sm:size-14">
          <DesktopIcon className="size-6 sm:size-7" />
        </span>
        <div className="min-w-0">
          <p className="m-0 font-display text-[clamp(16px,4.6vw,18px)] leading-snug font-semibold text-balance">Por ahora el manual es solo para escritorio</p>
          <p className="m-0 mt-2 text-[13.5px] leading-relaxed text-pretty text-muted sm:text-[14px]">
            Todavía no está adaptado a celular ni tablet. Abrilo en una compu o agrandá la ventana del navegador.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
