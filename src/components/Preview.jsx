import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SHOTS } from '../data'
import { DUR, EASE_OUT, SPRING } from '../motion'
import { CloseIcon, DesktopIcon, MobileIcon, ZoomIcon } from './Icons'

const viewIcon = (v) => (v === 'Desktop' ? <DesktopIcon className="relative size-[15px]" /> : <MobileIcon className="relative size-[15px]" />)
const viewOn = { Desktop: 'bg-blue', Mobile: 'bg-yellow' }
const viewText = { Desktop: 'text-white', Mobile: 'text-mobile-ink' }

// Cambio de captura: fundido con un leve zoom
const swap = {
  initial: { opacity: 0, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: DUR.slow, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 1.01, filter: 'blur(4px)', transition: { duration: DUR.fast } },
}

// El recuadro que marca la pieza: viaja con resorte de una pieza a otra
function Zone({ z, zoneRef, children, className = '' }) {
  return (
    <motion.div
      ref={zoneRef}
      initial={false}
      animate={{ left: `${z[0] * 100}%`, top: `${z[1] * 100}%`, width: `${z[2] * 100}%`, height: `${z[3] * 100}%` }}
      transition={SPRING.soft}
      className={`zone-sel absolute rounded-[3px] ${className}`}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-[-3px] rounded-[4px] border-2 border-yellow"
        animate={{ opacity: [0.9, 0], scale: [1, 1.06] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
      />
      {children}
    </motion.div>
  )
}

// Captura ampliada encima de la página. Se cierra con Esc, con la X o tocando afuera.
function Lightbox({ shot, view, z, piece, onClose }) {
  const scrollRef = useRef(null)
  const zoneRef = useRef(null)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])
  // En capturas largas, arrancar con la pieza a la vista
  const onLoad = () => {
    const sc = scrollRef.current
    const zone = zoneRef.current
    if (sc && zone) sc.scrollTop = Math.max(0, zone.offsetTop + zone.offsetParent.offsetTop - sc.clientHeight / 2 + zone.offsetHeight / 2)
  }
  return (
    <motion.div
      className="glass fixed inset-0 z-40 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.name}, ${shot.view}, ampliada`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: DUR.fast } }}
        onClick={(e) => e.stopPropagation()}
        className="soft-lg flex max-h-full max-w-full flex-col gap-3 rounded-3xl border border-glass-line bg-surface p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 flex items-center gap-2 text-[14px]">
            <b className="font-display font-semibold">{shot.label}</b>
            <span className={`inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-2 text-xs font-semibold ${viewOn[shot.view]} ${viewText[shot.view]}`}>
              {viewIcon(shot.view)}
              {shot.view}
            </span>
            <span className="text-muted">
              {piece.name} · {piece.dim} px
            </span>
          </p>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="cursor-pointer rounded-full p-1.5 text-muted transition-colors hover:bg-sunk hover:text-fg">
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div ref={scrollRef} className="relative min-h-0 overflow-auto rounded-2xl bg-sunk p-4">
          <div className="relative mx-auto w-fit overflow-hidden rounded-lg">
            <img
              src={`./img/${view}.webp`}
              width={shot.w}
              height={shot.h}
              alt={`${shot.label}, ${shot.view}`}
              onLoad={onLoad}
              className={`block h-auto max-w-[min(1200px,calc(100vw-96px))] ${shot.solo ? 'max-h-[calc(100vh-180px)] w-auto' : 'w-[min(1200px,calc(100vw-96px))]'}`}
            />
            <Zone z={z} zoneRef={zoneRef} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FichaSchematic() {
  // Esquema de la ficha de producto: miniaturas, galería e info. Coordenadas sobre 860 × 620.
  const box = (x, y, w, h, t = '') => (
    <i
      key={`${x}-${y}`}
      className="absolute grid place-items-center rounded-[3px] border border-line bg-sunk text-center text-[11px] text-muted not-italic"
      style={{ left: `${x / 8.6}%`, top: `${y / 6.2}%`, width: `${w / 8.6}%`, height: `${h / 6.2}%` }}
    >
      {t}
    </i>
  )
  return (
    <div className="relative aspect-[860/620] w-full max-w-[460px] overflow-hidden rounded-md bg-surface">
      {box(30, 40, 90, 90)}
      {box(30, 150, 90, 90)}
      {box(30, 260, 90, 90)}
      {box(140, 40, 380, 380)}
      <span className="absolute text-[10px] text-muted" style={{ left: `${148 / 8.6}%`, top: `${48 / 6.2}%` }}>
        Imagen grande de la galería
      </span>
      {box(560, 40, 270, 40, 'Nombre del producto')}
      {box(560, 100, 180, 40, 'Precio')}
      {box(560, 180, 270, 60, 'Agregar')}
      {/* Miniatura en la tira: solo un borde, sin oscurecer */}
      <div
        className="absolute grid place-items-center rounded-[3px] border-2 border-dashed border-yellow text-fg"
        style={{ left: `${30 / 8.6}%`, top: `${370 / 6.2}%`, width: `${90 / 8.6}%`, height: `${90 / 6.2}%` }}
      >
        ▶
      </div>
      {/* Donde se reproduce el video: la imagen grande, en 16:9 (380 × 214 dentro del cuadrado) */}
      <Zone z={[140 / 860, 123 / 620, 380 / 860, 214 / 620]} className="grid place-items-center text-center text-[11px] font-semibold text-fg">
        <span className="rounded-full bg-yellow px-2 py-0.5 text-mobile-ink">▶ Video 16:9</span>
      </Zone>
    </div>
  )
}

export default function Preview({ piece, view, availableViews, onView }) {
  const stageRef = useRef(null)
  const zoneRef = useRef(null)
  const [zoom, setZoom] = useState(false)
  const isFicha = !!piece.z.ficha
  const keys = Object.keys(piece.z)
  const shot = view && SHOTS[view]
  const z = shot ? piece.z[view] : null

  // Llevar la pieza resaltada al centro de la captura, con scroll suave.
  // Se mide sobre la imagen que está en pantalla (imgRef), no sobre la que se está yendo en la transición.
  const imgRef = useRef(null)
  const centerRef = useRef(() => {})
  centerRef.current = () => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img || !z || !img.isConnected) return
    const frame = img.parentElement // contenedor de la captura, posicionado dentro del escenario
    const h = img.offsetHeight
    const top = frame.offsetTop + z[1] * h - stage.clientHeight / 2 + (z[3] * h) / 2
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stage.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
  }
  useEffect(() => {
    requestAnimationFrame(() => centerRef.current())
  }, [piece.id, view])
  const setImg = (el) => {
    imgRef.current = el
    if (el && el.complete) requestAnimationFrame(() => centerRef.current())
  }

  let title, body, caption, bodyKey
  if (isFicha) {
    title = 'Ficha de producto · esquema'
    bodyKey = 'ficha'
    body = <FichaSchematic />
    caption = (
      <span>
        El video se reproduce en la <b className="font-semibold text-fg">imagen grande de la galería</b>, en 16:9. En la tira de miniaturas aparece como una más, con ▶.
        Va igual en desktop y mobile.
      </span>
    )
  } else if (!keys.length || !shot) {
    title = piece.name
    bodyKey = 'none'
    body = <p className="p-6 text-center text-[13.5px] text-muted">No es una pieza gráfica: es el color de fondo (bg) de toda la página del micrositio, detrás del patrón.</p>
    caption = null
  } else {
    title = shot.label
    bodyKey = view
    if (shot.solo) {
      // Pieza sola: entra entera en la vista, sin scroll (se achica a lo alto disponible)
      body = (
        <div className="soft relative inline-block max-w-full shrink-0 overflow-hidden rounded-lg">
          <img
            ref={setImg}
            src={`./img/${view}.webp`}
            width={shot.w}
            height={shot.h}
            alt={`${shot.label}, ${shot.view}`}
            className="block h-auto max-h-[388px] w-auto max-w-full lg:max-h-[calc(100vh-var(--bar-h,72px)-236px)]"
          />
          <Zone z={z} zoneRef={zoneRef} />
        </div>
      )
    } else {
      const width = shot.w < 600 ? Math.min(shot.w, 340) : shot.w
      body = (
        <div className="soft relative max-w-full shrink-0 overflow-hidden rounded-lg" style={{ width }}>
          <img
            ref={setImg}
            onLoad={() => centerRef.current()}
            src={`./img/${view}.webp`}
            width={shot.w}
            height={shot.h}
            alt={`${shot.label}, ${shot.view}`}
            className="block h-auto w-full"
          />
          <Zone z={z} zoneRef={zoneRef} />
        </div>
      )
    }
    caption = (
      <>
        <span className={`relative inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-2 text-xs font-semibold ${viewOn[shot.view]} ${viewText[shot.view]}`}>
          {viewIcon(shot.view)}
          {shot.view}
        </span>
        <span>
          {piece.name} · {piece.dim} px{shot.solo ? ' · pieza sola, sin interfaz' : ''}
        </span>
      </>
    )
  }

  return (
    <motion.aside
      aria-label="Dónde va la pieza"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE_OUT, delay: 0.1 }}
    >
      <div className="glass soft-lg flex flex-col gap-2.5 rounded-3xl border border-glass-line p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: DUR.fast }}
              className="font-display text-[15px] font-semibold"
            >
              {title}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-2">
          {shot && z && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setZoom(true)}
              title="Ver la captura más grande"
              className="inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-full border border-line/70 bg-surface/60 px-3 text-[13px] font-semibold text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <ZoomIcon className="size-4" />
              Ampliar
            </motion.button>
          )}
          {!isFicha && availableViews.length > 1 && (
            <div className="inline-flex rounded-full border border-line/70 bg-surface/60 p-[3px]" role="group" aria-label="Vista">
              {availableViews.map((k) => {
                const v = SHOTS[k].view
                const enabled = keys.includes(k)
                const on = k === view
                return (
                  <motion.button
                    key={k}
                    type="button"
                    whileTap={enabled ? { scale: 0.95 } : undefined}
                    aria-pressed={on}
                    disabled={!enabled}
                    title={enabled ? undefined : 'Esta pieza no va en esta vista'}
                    onClick={() => onView(k)}
                    className={`relative inline-flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-2.5 text-[13px] font-semibold transition-[color,opacity] duration-200 disabled:cursor-default disabled:opacity-35 ${
                      on ? viewText[v] : 'text-muted'
                    }`}
                  >
                    {on && <motion.span layoutId="view-pill" transition={SPRING.snappy} className={`absolute inset-0 rounded-full ${viewOn[v]}`} />}
                    {viewIcon(v)}
                    <span className="relative">{v}</span>
                  </motion.button>
                )
              })}
            </div>
          )}
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative flex max-h-[420px] items-start justify-center overflow-auto rounded-2xl bg-sunk/80 p-4 lg:max-h-[calc(100vh-var(--bar-h,72px)-200px)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={bodyKey} {...swap} className="flex w-full justify-center">
              {body}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {caption && (
            <motion.p
              key={`${piece.id}-${view}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: DUR.fast }}
              className="m-0 flex flex-wrap items-center gap-2 text-[13px] text-muted"
            >
              {caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {createPortal(
        <AnimatePresence>{zoom && shot && z && <Lightbox shot={shot} view={view} z={z} piece={piece} onClose={() => setZoom(false)} />}</AnimatePresence>,
        document.body,
      )}
    </motion.aside>
  )
}
