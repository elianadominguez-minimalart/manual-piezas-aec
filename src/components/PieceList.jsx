import { DEVICES } from '../data'
import { DeviceIcon } from './Icons'
import PieceCard from './PieceCard'

const tagStyle = {
  desktop: 'bg-blue text-white',
  mobile: 'bg-yellow text-mobile-ink',
  ambos: 'bg-surface text-fg ring-[1.5px] ring-inset ring-fg',
}

export default function PieceList({ pieces, all, selectedId, doneMap, videoMap, onSelect, onToggleDone, onToggleVideo, onReset }) {
  const doneCount = all.filter((p) => doneMap[p.id]).length
  return (
    <section aria-labelledby="list-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="list-title" className="m-0 font-display text-xl font-semibold">
          Piezas a entregar
        </h2>
        <div className="text-[13.5px] text-muted tabular-nums" aria-live="polite">
          {doneCount} de {all.length} entregadas
          {doneCount > 0 && (
            <button type="button" onClick={onReset} className="ml-2 cursor-pointer underline">
              Desmarcar todo
            </button>
          )}
        </div>
      </div>

      {DEVICES.map(([dev, label, hint]) => {
        const group = pieces.filter((p) => p.dev === dev)
        if (!group.length) return null
        return (
          <div key={dev} className="mt-5">
            <p className="mb-2.5 flex items-center gap-2.5 font-display text-[15px] font-semibold">
              <span className={`inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-3 ${tagStyle[dev]}`}>
                <DeviceIcon dev={dev} />
                {label}
              </span>
              <small className="font-sans text-[13px] font-normal text-muted">{hint}</small>
            </p>
            <div className="flex flex-col gap-2.5">
              {group.map((p) => (
                <PieceCard
                  key={p.id}
                  piece={p}
                  selected={p.id === selectedId}
                  selectedId={selectedId}
                  done={doneMap[p.id]}
                  doneMap={doneMap}
                  videoOn={videoMap[p.id]}
                  onSelect={onSelect}
                  onToggleDone={onToggleDone}
                  onToggleVideo={onToggleVideo}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
