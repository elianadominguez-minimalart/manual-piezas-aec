import { AnimatePresence, motion } from 'motion/react'
import { VIDEO_NOTE } from '../data'
import { DUR, SPRING, collapse, itemVariants } from '../motion'
import { CheckIcon, ChevronIcon, DeviceIcon, ImageIcon, VideoIcon } from './Icons'

const devBadge = {
  desktop: ['Desktop', 'bg-blue text-white'],
  mobile: ['Mobile', 'bg-yellow text-mobile-ink'],
  ambos: ['Desktop y mobile', 'bg-surface text-fg ring-[1.5px] ring-inset ring-fg'],
}

function Chips({ chips = [] }) {
  return chips.map((c) => (
    <span
      key={c}
      className={`rounded-full px-2 py-px text-[10.5px] font-semibold tracking-wide uppercase ${c === 'Opcional' ? 'bg-sunk text-muted' : 'bg-warn-soft text-warn'}`}
    >
      {c}
    </span>
  ))
}

// Una versión de la pieza (desktop, mobile o ambos): se toca para verla en la captura y abrir sus notas
function Row({ p, selectedId, doneMap, onSelect, onToggleDone, showChips }) {
  const selected = p.id === selectedId
  const done = !!doneMap[p.id]
  const hasDim = /\d/.test(p.dim)
  const [label, badge] = devBadge[p.dev]
  return (
    <div className={`rounded-xl transition-colors duration-300 ${selected ? 'bg-blue-soft/60' : ''} ${done ? 'bg-[linear-gradient(var(--ok-soft),var(--ok-soft))]' : ''}`}>
      <button
        type="button"
        aria-expanded={selected}
        aria-label={`${p.name}, ${label}`}
        onClick={() => onSelect(p.id)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-sunk/60 focus-visible:outline-2 focus-visible:outline-blue"
      >
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2 text-[12px] font-semibold ${badge}`}>
          <DeviceIcon dev={p.dev} className="size-[15px]" />
          {label}
        </span>
        <span className="min-w-0 flex-1 text-[13px] text-muted">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            {p.fmt}
            {p.kb && <> · máx. {p.kb}</>}
            {showChips && <Chips chips={p.chips} />}
          </span>
        </span>
        <AnimatePresence initial={false}>
          {done && (
            <motion.span
              key="done"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: SPRING.pop }}
              exit={{ scale: 0, opacity: 0, transition: { duration: DUR.fast } }}
              className="grid size-5 shrink-0 place-items-center rounded-full bg-ok text-white"
              title="Entregada"
            >
              <CheckIcon className="size-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className={`shrink-0 text-right font-mono text-[17px] font-medium tracking-tight tabular-nums sm:text-[19px] ${done ? 'text-muted' : ''}`}>
          {p.dim}
          {hasDim && <small className="ml-0.5 font-sans text-[12px] font-normal text-muted">px</small>}
        </span>
        <motion.span animate={{ rotate: selected ? 90 : 0 }} transition={SPRING.snappy} className="shrink-0 text-muted">
          <ChevronIcon className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {selected && (
          <motion.div key="body" {...collapse} className="overflow-hidden">
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2 px-3 pt-0.5 pb-3">
              {p.note && <p className="m-0 max-w-[62ch] flex-1 basis-64 text-[13.5px] leading-relaxed text-muted">{p.note}</p>}
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                aria-pressed={done}
                onClick={() => onToggleDone(p.id)}
                className={`ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-semibold transition-colors duration-300 ${
                  done ? 'border-ok bg-ok text-white' : 'border-line bg-surface text-muted hover:border-ok hover:text-ok'
                }`}
              >
                <CheckIcon className="size-3.5" />
                {done ? 'Entregada' : 'Marcar entregada'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Divisor fino entre desktop y mobile
function Joint() {
  return <div className="mx-3 my-0.5 border-t border-line/70" aria-hidden="true" />
}

function Rows({ rows, joint = true, ...rest }) {
  return rows.map((p, i) => (
    <div key={p.id}>
      {i > 0 && joint && <Joint />}
      <Row p={p} {...rest} />
    </div>
  ))
}

// Tarjeta de una pieza: título + sus versiones (desktop/mobile juntas, o una sola si es para los dos)
export default function PieceCard({ name, rows, selectedId, doneMap, videoMap, onSelect, onToggleDone, onToggleVideo }) {
  const head = rows[0]
  const hasVideo = rows.some((p) => p.video)
  const videoOn = rows.some((p) => p.video && videoMap[p.id])
  const isSelected = rows.some((p) => p.id === selectedId) || (videoOn && rows.some((p) => p.video?.some((v) => v.id === selectedId)))
  const allDone = rows.every((p) => doneMap[p.id])
  const single = rows.length === 1
  // Video y portada, agrupados como pares desktop/mobile
  const videoGroups = videoOn
    ? ['Video', 'Portada del video'].map((n) => ({ name: n, rows: rows.flatMap((p) => (videoMap[p.id] ? p.video.filter((v) => v.name === n) : [])) }))
    : []

  return (
    <motion.article
      layout="position"
      variants={itemVariants}
      transition={SPRING.soft}
      aria-label={name}
      className={`overflow-hidden rounded-2xl border bg-surface transition-[box-shadow,border-color] duration-300 ${
        isSelected ? 'border-blue/50 shadow-[0_0_0_1px_var(--blue),0_18px_48px_rgba(16,32,60,.12)]' : 'soft border-line/70'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-3.5 pb-1.5">
        <h3 className={`m-0 flex flex-wrap items-center gap-2 text-[15.5px] font-semibold transition-colors ${allDone ? 'text-muted line-through decoration-muted' : ''}`}>
          {name}
          {!single && <Chips chips={head.chips} />}
        </h3>
        {hasVideo && (
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-blue-ink">
            <input
              type="checkbox"
              checked={videoOn}
              onChange={(e) => onToggleVideo(rows.find((p) => p.video), e.target.checked)}
              className="relative m-0 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition-colors duration-300 after:absolute after:top-[3px] after:left-[3px] after:size-3.5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-300 after:ease-[cubic-bezier(.34,1.56,.64,1)] after:content-[''] checked:bg-blue checked:after:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            />
            <VideoIcon className="size-4" />
            Lleva video
          </label>
        )}
      </div>

      <div className="px-1.5 pb-1.5">
        <Rows rows={rows} selectedId={selectedId} doneMap={doneMap} onSelect={onSelect} onToggleDone={onToggleDone} showChips={single} />
      </div>

      <AnimatePresence initial={false}>
        {videoOn && (
          <motion.div key="video" {...collapse} className="overflow-hidden">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
              className="mx-3 mb-3 flex flex-col gap-2 rounded-xl border border-dashed border-blue/50 bg-blue-soft/30 p-2"
            >
              <motion.p variants={itemVariants} className="m-0 px-1.5 pt-0.5 text-[13px] text-muted">
                Reemplaza a este banner. <b className="font-semibold text-fg">Sin portada no hay video:</b> se entregan siempre los dos.
              </motion.p>
              {/* Video y portada en un mismo bloque: se entregan juntos */}
              <motion.div variants={itemVariants} className="rounded-xl bg-surface p-1">
                {videoGroups.map((g, i) => (
                  <div key={g.name}>
                    {i > 0 && <div className="mx-2.5 my-1 border-t border-line/70" aria-hidden="true" />}
                    {g.name === 'Portada del video' ? (
                      <p className="m-0 flex flex-wrap items-center gap-1.5 px-2.5 pt-2 pb-0.5 text-[13.5px] font-semibold">
                        <ImageIcon className="size-4 text-blue" />
                        Portada del video
                        <span className="rounded-full bg-blue-soft px-2 py-px text-[10.5px] font-semibold tracking-wide text-blue-ink uppercase">Imagen</span>
                        <span className="rounded-full bg-warn-soft px-2 py-px text-[10.5px] font-semibold tracking-wide text-warn uppercase">Obligatoria</span>
                        <span className="w-full text-[12.5px] font-normal text-muted">Una imagen fija que se ve mientras el video carga.</span>
                      </p>
                    ) : (
                      <p className="m-0 flex flex-wrap items-center gap-1.5 px-2.5 pt-2 pb-0.5 text-[13.5px] font-semibold">
                        <VideoIcon className="size-4 text-blue" />
                        {g.name}
                      </p>
                    )}
                    <Rows rows={g.rows} joint={false} selectedId={selectedId} doneMap={doneMap} onSelect={onSelect} onToggleDone={onToggleDone} />
                  </div>
                ))}
              </motion.div>
              <motion.p variants={itemVariants} className="m-0 max-w-[70ch] px-1.5 pb-0.5 text-[12.5px] text-muted">
                {VIDEO_NOTE}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
