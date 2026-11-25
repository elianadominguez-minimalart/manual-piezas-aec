import { VIDEO_NOTE, devName } from '../data'
import { CheckIcon } from './Icons'

const stripe = {
  desktop: 'border-l-blue',
  mobile: 'border-l-yellow',
  ambos: 'border-l-fg',
}

export default function PieceCard({ piece: p, selected, done, videoOn, onSelect, onToggleDone, onToggleVideo, child = false, doneMap, selectedId }) {
  const hasDim = /\d/.test(p.dim)
  return (
    <>
      <article
        tabIndex={0}
        aria-label={`${p.name}, ${devName(p.dev)}`}
        onClick={() => onSelect(p.id)}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onSelect(p.id)
          }
        }}
        className={`flex cursor-pointer flex-col gap-1.5 rounded-[10px] border border-line px-4 pt-3.5 pb-3 transition-shadow hover:shadow-[0_2px_10px_rgba(0,40,90,.08)] focus-visible:outline-2 focus-visible:outline-blue ${
          child ? '' : `border-l-[6px] ${stripe[p.dev]}`
        } ${selected ? 'ring-2 ring-blue' : ''} ${done ? 'bg-ok-soft' : 'bg-surface'}`}
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className={`text-[15.5px] font-semibold ${done ? 'line-through decoration-muted' : ''}`}>
            {child && <span className="mr-1 text-xs text-blue">▶</span>}
            {p.name}
          </span>
          {(p.chips || []).map((c) => (
            <span
              key={c}
              className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold tracking-wide uppercase ${
                c === 'Opcional' ? 'bg-sunk text-muted' : 'bg-warn-soft text-warn'
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-4.5 gap-y-1">
          <span className="font-mono text-[21px] font-medium tracking-tight tabular-nums">
            {p.dim}
            {hasDim && <small className="ml-1 font-sans text-[13px] font-normal text-muted">px</small>}
          </span>
          <span className="text-[13.5px] text-muted">
            <b className="font-semibold text-fg">{p.fmt}</b>
            {p.kb && (
              <>
                {' '}· máx. <b className="font-semibold text-fg">{p.kb}</b>
              </>
            )}
          </span>
        </div>

        {p.note && <p className="m-0 text-[13.5px] text-muted">{p.note}</p>}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-line pt-2">
          {p.video && (
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13.5px] font-semibold text-blue-ink" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={!!videoOn}
                onChange={(e) => onToggleVideo(p, e.target.checked)}
                className="relative m-0 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-3.5 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-blue checked:after:translate-x-4"
              />
              Lleva video
            </label>
          )}
          <button
            type="button"
            aria-pressed={!!done}
            onClick={(e) => {
              e.stopPropagation()
              onToggleDone(p.id)
            }}
            className={`ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px] font-medium hover:bg-sunk ${done ? 'text-ok' : 'text-muted hover:text-fg'}`}
          >
            <CheckIcon />
            {done ? 'Entregada' : 'Marcar entregada'}
          </button>
        </div>
      </article>

      {p.video && videoOn && (
        <div className="my-1 ml-4.5 flex flex-col gap-2 border-l-2 border-dashed border-blue pl-3.5">
          <p className="m-0 text-[13px] text-muted">Reemplaza a este banner. Entregá también:</p>
          {p.video.map((v) => (
            <PieceCard
              key={v.id}
              piece={v}
              child
              selected={v.id === selectedId}
              done={doneMap[v.id]}
              onSelect={onSelect}
              onToggleDone={onToggleDone}
              onToggleVideo={onToggleVideo}
              doneMap={doneMap}
              selectedId={selectedId}
            />
          ))}
          <p className="m-0 max-w-[70ch] text-[13px] text-muted">{VIDEO_NOTE}</p>
        </div>
      )}
    </>
  )
}
