import { useEffect, useRef } from 'react'
import { SHOTS } from '../data'
import { DesktopIcon, MobileIcon } from './Icons'

const viewIcon = (v) => (v === 'Desktop' ? <DesktopIcon className="size-[15px]" /> : <MobileIcon className="size-[15px]" />)
const viewOn = { Desktop: 'bg-blue text-white', Mobile: 'bg-yellow text-mobile-ink' }

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
      {box(140, 40, 380, 380, 'Galería del producto')}
      {box(560, 40, 270, 40, 'Nombre del producto')}
      {box(560, 100, 180, 40, 'Precio')}
      {box(560, 180, 270, 60, 'Agregar')}
      <div
        className="zone-sel absolute grid place-items-center rounded-[3px] text-fg"
        style={{ left: `${30 / 8.6}%`, top: `${370 / 6.2}%`, width: `${90 / 8.6}%`, height: `${90 / 6.2}%` }}
      >
        ▶
      </div>
    </div>
  )
}

export default function Preview({ piece, view, availableViews, onView }) {
  const stageRef = useRef(null)
  const zoneRef = useRef(null)
  const isFicha = !!piece.z.ficha
  const keys = Object.keys(piece.z)
  const shot = view && SHOTS[view]

  // Centrar la pieza resaltada dentro de la captura
  useEffect(() => {
    const stage = stageRef.current
    const zone = zoneRef.current
    if (!stage || !zone) return
    const center = () => {
      stage.scrollTop = Math.max(0, zone.offsetTop - stage.clientHeight / 2 + zone.offsetHeight / 2)
    }
    const img = stage.querySelector('img')
    if (img && !img.complete) img.addEventListener('load', center, { once: true })
    else center()
  }, [piece.id, view])

  let title, body, caption
  if (isFicha) {
    title = 'Ficha de producto · esquema'
    body = <FichaSchematic />
    caption = <span>Va como una diapositiva más de la galería del producto, en desktop y mobile.</span>
  } else if (!keys.length || !shot) {
    title = piece.name
    body = <p className="p-6 text-center text-[13.5px] text-muted">No es una pieza gráfica: es el color de fondo (bg) de toda la página del micrositio, detrás del patrón.</p>
    caption = null
  } else {
    const z = piece.z[view]
    const width = shot.w < 600 ? Math.min(shot.w, 340) : shot.w
    title = shot.label
    body = (
      <div className="relative max-w-full shrink-0 overflow-hidden rounded" style={{ width }}>
        <img src={`./img/${view}.webp`} width={shot.w} height={shot.h} alt={`${shot.label}, ${shot.view}`} className="block h-auto w-full" />
        <div
          ref={zoneRef}
          className="zone-sel absolute rounded-[3px]"
          style={{ left: `${z[0] * 100}%`, top: `${z[1] * 100}%`, width: `${z[2] * 100}%`, height: `${z[3] * 100}%` }}
        />
      </div>
    )
    caption = (
      <>
        <span className={`inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-2 text-xs font-semibold ${viewOn[shot.view]}`}>
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
    <aside className="lg:sticky lg:top-4" aria-label="Dónde va la pieza">
      <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="font-display text-[15px] font-semibold">{title}</div>
          {!isFicha && availableViews.length > 1 && (
            <div className="inline-flex rounded-full bg-sunk p-[3px]" role="group" aria-label="Vista">
              {availableViews.map((k) => {
                const v = SHOTS[k].view
                const enabled = keys.includes(k)
                const on = k === view
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    disabled={!enabled}
                    title={enabled ? undefined : 'Esta pieza no va en esta vista'}
                    onClick={() => onView(k)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-2.5 text-[13px] font-semibold disabled:cursor-default disabled:opacity-35 ${
                      on ? viewOn[v] : 'text-muted'
                    }`}
                  >
                    {viewIcon(v)}
                    {v}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div ref={stageRef} className="flex max-h-[420px] items-start justify-center overflow-auto rounded-[10px] bg-sunk p-4 lg:max-h-[min(72vh,760px)]">
          {body}
        </div>

        {caption && <p className="m-0 flex flex-wrap items-center gap-2 text-[13px] text-muted">{caption}</p>}
      </div>
    </aside>
  )
}
