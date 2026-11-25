import { useEffect, useMemo, useState } from 'react'
import { CONTEXTS, HASH, SHOTS } from './data'
import useStoredState from './useStoredState'
import Header from './components/Header'
import ContextPicker from './components/ContextPicker'
import PieceList from './components/PieceList'
import Preview from './components/Preview'

const fromHash = () => {
  const h = window.location.hash.slice(1)
  return Object.keys(HASH).find((k) => HASH[k] === h) || null
}

export default function App() {
  const [ctx, setCtx] = useState(() => fromHash() || 'home')
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState(null)
  const [lastVariant, setLastVariant] = useStoredState('lastVar', 'mic1')
  const [doneMap, setDoneMap] = useStoredState(`done-${ctx}`, {})
  const [videoMap, setVideoMap] = useStoredState(`video-${ctx}`, {})

  const pieces = CONTEXTS[ctx].pieces
  // Lista completa: piezas + video/portada de los banners que tienen "Lleva video" activado
  const all = useMemo(() => pieces.flatMap((p) => [p, ...(p.video && videoMap[p.id] ? p.video : [])]), [pieces, videoMap])
  const selected = all.find((p) => p.id === selectedId) || all[0]

  // Vista de la captura: la elegida si la pieza va ahí, si no la primera donde va
  const keys = Object.keys(selected.z).filter((k) => SHOTS[k])
  const currentView = view && keys.includes(view) ? view : keys[0] || null
  const label = currentView && SHOTS[currentView].label
  const availableViews = currentView ? Object.keys(SHOTS).filter((k) => SHOTS[k].label === label && all.some((p) => k in p.z)) : []

  // Hash en la URL para poder pasar el link de una sección
  useEffect(() => {
    if (window.location.hash.slice(1) !== HASH[ctx]) history.replaceState(null, '', `#${HASH[ctx]}`)
  }, [ctx])
  useEffect(() => {
    const onHash = () => {
      const k = fromHash()
      if (k) pick(k)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  })

  function pick(k) {
    const next = k === 'mic' ? (ctx.startsWith('mic') ? ctx : lastVariant) : k
    if (next.startsWith('mic')) setLastVariant(next)
    setCtx(next)
    setSelectedId(null)
    setView(null)
  }

  function toggleVideo(piece, on) {
    setVideoMap((m) => ({ ...m, [piece.id]: on }))
    setSelectedId(on ? piece.video[0].id : piece.id)
    setView(null)
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <ContextPicker ctx={ctx} onPick={pick} />
        <div className="mt-7 grid items-start gap-8 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="order-2 lg:order-1">
            <PieceList
              pieces={pieces}
              all={all}
              selectedId={selected.id}
              doneMap={doneMap}
              videoMap={videoMap}
              onSelect={(id) => {
                setSelectedId(id)
                setView(null)
              }}
              onToggleDone={(id) => setDoneMap((d) => ({ ...d, [id]: !d[id] }))}
              onToggleVideo={toggleVideo}
              onReset={() => setDoneMap({})}
            />
          </div>
          <div className="order-1 lg:order-2">
            <Preview piece={selected} view={currentView} availableViews={availableViews} onView={setView} />
          </div>
        </div>
      </main>
      <footer className="mx-auto max-w-[1360px] px-4 pb-10 text-[13px] text-muted sm:px-6">
        Detalle visual completo en el{' '}
        <a className="text-blue" href="https://www.figma.com/board/rfpC69mZKsF0uXKR15xfBe/Especificaciones-t%C3%A9cnicas---Arcor-en-Casa" target="_blank" rel="noopener">
          board de especificaciones técnicas
        </a>{' '}
        (Figma).
      </footer>
    </>
  )
}
