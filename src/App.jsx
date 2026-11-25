import { useEffect, useMemo, useState } from 'react'
import { CONTEXTS, HASH, SHOTS, TITLES } from './data'
import useStoredState from './useStoredState'
import useTheme from './useTheme'
import TopBar from './components/TopBar'
import DesktopOnly from './components/DesktopOnly'
import PieceList from './components/PieceList'
import Preview from './components/Preview'

const fromHash = () => {
  const h = window.location.hash.slice(1)
  return Object.keys(HASH).find((k) => HASH[k] === h) || null
}

export default function App() {
  const [theme, setTheme] = useTheme()
  const [ctx, setCtx] = useState(() => fromHash() || 'home')
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState(null)
  const [lastVariant, setLastVariant] = useStoredState('lastVar', 'mic1')
  const [doneMap, setDoneMap] = useStoredState(`done-${ctx}`, {})
  const [videoMap, setVideoMap] = useStoredState(`video-${ctx}`, {})

  const pieces = CONTEXTS[ctx].pieces
  // Lista completa: piezas + video/portada de los banners con "Lleva video" activado
  const all = useMemo(() => pieces.flatMap((p) => [p, ...(p.video && videoMap[p.id] ? p.video : [])]), [pieces, videoMap])
  const selected = all.find((p) => p.id === selectedId) || all[0]

  // Si un banner lleva video, el video y la portada lo reemplazan:
  // el banner cuenta como entregado cuando están entregados los dos, y no suma aparte al contador.
  const withVideo = (p) => p.video && videoMap[p.id]
  const effectiveDone = { ...doneMap }
  for (const p of pieces) if (withVideo(p)) effectiveDone[p.id] = p.video.every((v) => doneMap[v.id])
  const deliverables = all.filter((p) => !withVideo(p))

  function toggleDone(id) {
    const parent = pieces.find((p) => p.id === id && withVideo(p))
    if (parent) {
      const next = !effectiveDone[id]
      setDoneMap((d) => ({ ...d, ...Object.fromEntries(parent.video.map((v) => [v.id, next])) }))
    } else setDoneMap((d) => ({ ...d, [id]: !d[id] }))
  }

  // Vista de la captura: la elegida si la pieza va ahí; si no, la primera donde va
  const keys = Object.keys(selected.z).filter((k) => SHOTS[k])
  const currentView = view && keys.includes(view) ? view : keys[0] || null
  const label = currentView && SHOTS[currentView].label
  const availableViews = currentView ? Object.keys(SHOTS).filter((k) => SHOTS[k].label === label && CONTEXTS[ctx].pieces.some((p) => k in p.z)) : []

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
    window.scrollTo({ top: 0 })
  }

  // El video va siempre en par: se activa o desactiva en desktop y mobile a la vez
  function toggleVideo(piece, on) {
    setVideoMap((m) => ({ ...m, [piece.id]: on, ...(piece.pair ? { [piece.pair.id]: on } : {}) }))
    setSelectedId(on ? piece.video[0].id : piece.id)
    setView(null)
  }

  function selectPiece(id) {
    setSelectedId(id)
    setView(null)
  }

  return (
    <>
      <DesktopOnly />
      <TopBar ctx={ctx} onPick={pick} theme={theme} setTheme={setTheme} />
      <main className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <div className="grid items-start gap-6 pt-6 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10 lg:pt-8">
          <div className="order-2 lg:order-1">
            <PieceList
              ctx={ctx}
              title={TITLES[ctx]}
              pieces={pieces}
              all={deliverables}
              selectedId={selected.id}
              doneMap={effectiveDone}
              videoMap={videoMap}
              onSelect={selectPiece}
              onToggleDone={toggleDone}
              onToggleVideo={toggleVideo}
              onReset={() => setDoneMap({})}
            />
            <p className="mt-10 mb-0 text-[13px] text-muted">
              Detalle visual completo en el{' '}
              <a className="text-blue" href="https://www.figma.com/board/rfpC69mZKsF0uXKR15xfBe/Especificaciones-t%C3%A9cnicas---Arcor-en-Casa" target="_blank" rel="noopener">
                board de especificaciones técnicas
              </a>{' '}
              (Figma).
            </p>
          </div>
          <div className="order-1 lg:sticky lg:top-[calc(var(--bar-h,72px)+16px)] lg:order-2">
            <Preview piece={selected} view={currentView} availableViews={availableViews} onView={setView} />
          </div>
        </div>
      </main>
    </>
  )
}
