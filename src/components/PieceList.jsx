import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { DUR, EASE_OUT, SPRING, itemVariants, listVariants } from '../motion'
import { DeviceIcon } from './Icons'
import PieceCard from './PieceCard'

const tagStyle = {
  desktop: 'bg-blue text-white',
  mobile: 'bg-yellow text-mobile-ink',
  ambos: 'bg-surface text-fg ring-[1.5px] ring-inset ring-fg',
}

export default function PieceList({ ctx, title, pieces, all, selectedId, doneMap, videoMap, onSelect, onToggleDone, onToggleVideo, onReset }) {
  const doneCount = all.filter((p) => doneMap[p.id]).length
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0

  // Agrupar por pieza: desktop y mobile del mismo nombre van en una sola tarjeta (desktop primero)
  const units = []
  for (const p of pieces) {
    const key = p.dev === 'ambos' ? `${p.name}·${p.id}` : p.name
    let u = units.find((x) => x.key === key)
    if (!u) units.push((u = { key, name: p.name, shared: p.dev === 'ambos', rows: [] }))
    u.rows.push(p)
  }
  for (const u of units) u.rows.sort((a, b) => (a.dev === 'desktop' ? -1 : b.dev === 'desktop' ? 1 : 0))
  const paired = units.filter((u) => !u.shared)
  const shared = units.filter((u) => u.shared)
  const cardProps = { selectedId, doneMap, videoMap, onSelect, onToggleDone, onToggleVideo }

  return (
    <section aria-labelledby="list-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ctx}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            <h1 id="list-title" className="m-0 font-display text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold text-balance">
              {title}
            </h1>
            <p className="m-0 mt-1 text-[13.5px] text-muted">Tocá una pieza para ver dónde va y sus notas.</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3 text-[13px] text-muted tabular-nums" aria-live="polite">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/70" aria-hidden="true">
          <motion.div className="h-full rounded-full bg-ok" initial={false} animate={{ width: `${pct}%` }} transition={SPRING.soft} />
        </div>
        <span>
          <motion.span key={doneCount} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING.pop} className="inline-block">
            {doneCount}
          </motion.span>{' '}
          de {all.length} entregadas
        </span>
        <AnimatePresence>
          {doneCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              type="button"
              onClick={onReset}
              className="cursor-pointer underline hover:text-fg"
            >
              Desmarcar
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* key = sección + filtro: al cambiar, las tarjetas vuelven a entrar escalonadas */}
      <LayoutGroup>
        <motion.div key={ctx} initial="hidden" animate="show" variants={listVariants} className="mt-6 flex flex-col gap-3">
          {paired.map((u) => (
            <PieceCard key={u.name} {...u} {...cardProps} />
          ))}
          {shared.length > 0 && (
            <motion.p variants={itemVariants} className="mt-4 mb-0 flex items-center gap-2.5 font-display text-[14px] font-semibold">
              <span className={`inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 ${tagStyle.ambos}`}>
                <DeviceIcon dev="ambos" className="size-4" />
                Desktop y mobile
              </span>
              <small className="font-sans text-[12.5px] font-normal text-muted">un mismo archivo para los dos</small>
            </motion.p>
          )}
          {shared.map((u) => (
            <PieceCard key={u.name} {...u} {...cardProps} />
          ))}
        </motion.div>
      </LayoutGroup>
    </section>
  )
}
