import { TOP, VARIANTS } from '../data'

export default function ContextPicker({ ctx, onPick }) {
  const isMic = ctx.startsWith('mic')
  return (
    <section className="mt-7" aria-labelledby="pick-title">
      <p id="pick-title" className="mb-3 font-display text-lg font-semibold">
        ¿Qué estás armando?
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="pick-title">
        {TOP.map(([k, label]) => {
          const on = k === ctx || (k === 'mic' && isMic)
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(k)}
              className={`cursor-pointer rounded-full border-[1.5px] px-4.5 py-2 text-[14.5px] font-semibold transition-colors ${
                on ? 'border-blue bg-blue text-white' : 'border-line bg-surface hover:border-blue'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {isMic && (
        <div className="mt-3.5 grid max-w-[660px] grid-cols-3 gap-2.5" role="group" aria-label="Variante de micrositio">
          {VARIANTS.map(([k, label, hint]) => {
            const on = k === ctx
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => onPick(k)}
                className={`flex min-w-0 cursor-pointer flex-col gap-1.5 rounded-xl border-[1.5px] bg-surface p-2 text-left ${
                  on ? 'border-blue ring-[1.5px] ring-blue' : 'border-line'
                }`}
              >
                <img src={`./img/${k}-d.webp`} alt="" className="block h-21 w-full rounded-lg object-cover object-top" />
                <b className="text-[13.5px]">{label}</b>
                <small className="text-xs leading-snug text-muted">{hint}</small>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
