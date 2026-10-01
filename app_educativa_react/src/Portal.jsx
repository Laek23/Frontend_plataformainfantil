import { useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import './style.css'

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const rewardIcons = { sticker: '🦉', glasses: '🥽', aura: '✨', uniform: '🧥', rank: '🏅' }
const rankFor = (xp) => xp >= 150 ? 'Rango Élite' : xp >= 100 ? 'Maestro Estratega' : xp >= 60 ? 'Explorador Estelar' : xp >= 30 ? 'Aventurero' : 'Cadete'

async function api(path, token, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    })
    const data = response.status === 204 ? {} : await response.json()
    if (!response.ok) throw new Error(data.message || 'No se pudo completar la solicitud.')
    return data
  } catch (requestError) {
    if (requestError.name === 'AbortError') throw new Error('El servidor tardó demasiado en responder. Revisa tu conexión y vuelve a intentarlo.')
    if (requestError instanceof TypeError) throw new Error('No se pudo conectar con el servidor. Comprueba tu conexión a internet e inténtalo de nuevo.')
    throw requestError
  } finally {
    clearTimeout(timeout)
  }
}

function AuthView({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, null, { method: 'POST', body: JSON.stringify(form) })
      onLogin(result.user, result.token)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="kids-auth">
      <div className="auth-spark spark-one">✦</div><div className="auth-spark spark-two">★</div>
      <section className="kids-auth-panel">
        <div className="kids-mascot" aria-hidden="true">🧭</div>
        <span className="kids-eyebrow">AVENTUM KIDS</span>
        <h1>{mode === 'login' ? '¡Tu aventura te espera!' : '¡Únete a la aventura!'}</h1>
        <p>Entra a tu mundo de retos, estrellas y descubrimientos.</p>
        <form onSubmit={submit}>
          {mode === 'register' && <label>¿Cómo te llamas?<input required maxLength="100" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
          <label>Correo de tu familia<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Contraseña<input required type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {mode === 'register' && <label>Repite la contraseña<input required type="password" minLength="8" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} /></label>}
          <button className="kids-primary-button" disabled={busy}>{busy ? 'Verificando cuenta...' : mode === 'login' ? 'Entrar a jugar' : 'Crear cuenta'}</button>
        </form>
        {error && <p className="kids-error" role="alert">{error}</p>}
        <button className="kids-text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
          {mode === 'login' ? '¿Primera vez aquí? Regístrate' : 'Ya tengo cuenta'}
        </button>
      </section>
    </main>
  )
}

function ActivityForm({ subject, token, initial, onSaved, onCancel }) {
  const [type, setType] = useState(initial?.type || 'sumador')
  const [title, setTitle] = useState(initial?.title || '')
  const [prompt, setPrompt] = useState(initial?.prompt || '')
  const [hint, setHint] = useState(initial?.hint || '')
  const [answer, setAnswer] = useState(initial?.answer || '')
  const [firstNumber, setFirstNumber] = useState(initial?.content?.numbers?.[0] || '')
  const [secondNumber, setSecondNumber] = useState(initial?.content?.numbers?.[1] || '')
  const [options, setOptions] = useState(initial?.content?.options?.join(', ') || '')
  const [word, setWord] = useState(initial?.content?.word || '')
  const [grid, setGrid] = useState(initial?.content?.grid?.join(', ') || '')
  const [clue, setClue] = useState(initial?.content?.clue || '')
  const [cards, setCards] = useState([...new Set(initial?.content?.cards || [])].join(', '))
  const [seconds, setSeconds] = useState(initial?.content?.seconds || 20)
  const [error, setError] = useState('')

  const save = async (event) => {
    event.preventDefault()
    let content = {}
    if (type === 'sumador') content = { numbers: [Number(firstNumber), Number(secondNumber)], options: options.split(',').map((item) => item.trim()).filter(Boolean) }
    if (type === 'sopa') content = { word: word.toUpperCase(), grid: grid.split(',').map((item) => item.trim().toUpperCase()).filter(Boolean) }
    if (type === 'crucigrama') content = { clue }
    if (type === 'memorama') content = { cards: cards.split(',').map((item) => item.trim()).filter(Boolean) }
    if (type === 'tiempo') content = { options: options.split(',').map((item) => item.trim()).filter(Boolean), seconds: Number(seconds), ...(firstNumber && secondNumber ? { numbers: [Number(firstNumber), Number(secondNumber)] } : {}) }
    if (type === 'adivina') content = { placeholder: 'Escribe tu respuesta' }
    try {
      const endpoint = initial ? `/admin/activities/${initial.id}` : `/admin/subjects/${subject.id}/activities`
      const result = await api(endpoint, token, { method: initial ? 'PATCH' : 'POST', body: JSON.stringify({ type, title, prompt, hint, answer: type === 'memorama' ? 'memorama' : answer, content }) })
      onSaved(result.activity)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <form className="admin-editor" onSubmit={save}>
      <div className="editor-title"><div><span className="kids-eyebrow">{initial ? 'EDITAR RETO' : 'NUEVA ACTIVIDAD'}</span><h3>{subject.name}</h3></div>{onCancel && <button type="button" className="quiet-button" onClick={onCancel}>Cancelar</button>}</div>
      <label>Tipo de juego<select value={type} onChange={(event) => setType(event.target.value)}><option value="sumador">Suma y elige el resultado</option><option value="sopa">Ordena las letras</option><option value="crucigrama">Responde una pista</option><option value="memorama">Memorama de parejas</option><option value="tiempo">Reto contrarreloj</option><option value="adivina">Adivina la respuesta</option></select></label>
      <label>Nombre del reto<input required maxLength="120" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label>Instrucción para el jugador<input required value={prompt} onChange={(event) => setPrompt(event.target.value)} /></label>
      <label>Pista opcional<input value={hint} onChange={(event) => setHint(event.target.value)} /></label>
      {type === 'sumador' && <div className="editor-grid"><label>Primer número<input type="number" required value={firstNumber} onChange={(event) => setFirstNumber(event.target.value)} /></label><label>Segundo número<input type="number" required value={secondNumber} onChange={(event) => setSecondNumber(event.target.value)} /></label><label className="editor-wide">Respuestas posibles, separadas por coma<input required value={options} onChange={(event) => setOptions(event.target.value)} placeholder="6, 7, 8, 9" /></label></div>}
      {type === 'sopa' && <div className="editor-grid"><label>Palabra correcta<input required value={word} onChange={(event) => setWord(event.target.value)} /></label><label>Letras del juego, separadas por coma<input required value={grid} onChange={(event) => setGrid(event.target.value)} placeholder="L, A, R, M, U, N, A" /></label></div>}
      {type === 'crucigrama' && <label>Pista del crucigrama<input required value={clue} onChange={(event) => setClue(event.target.value)} /></label>}
      {type === 'memorama' && <label>Tarjetas únicas, separadas por coma<input required value={cards} onChange={(event) => setCards(event.target.value)} placeholder="🌙, ⭐, 🚀" /><small>El juego crea dos tarjetas iguales por cada elemento.</small></label>}
      {type === 'tiempo' && <div className="editor-grid"><label>Opciones separadas por coma<input required value={options} onChange={(event) => setOptions(event.target.value)} /></label><label>Tiempo límite en segundos<input required type="number" min="5" max="120" value={seconds} onChange={(event) => setSeconds(event.target.value)} /></label></div>}
      {type === 'adivina' && <label>La pista va en “Instrucción” y el jugador escribirá la respuesta.</label>}
      {type !== 'memorama' && <label>Respuesta correcta<input required value={answer} onChange={(event) => setAnswer(event.target.value)} /></label>}
      {error && <p className="kids-error">{error}</p>}
      <button className="kids-primary-button">{initial ? 'Guardar cambios' : 'Crear actividad'}</button>
    </form>
  )
}

function AdminView({ token, onLogout }) {
  const [subjects, setSubjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [activities, setActivities] = useState([])
  const [editing, setEditing] = useState(null)
  const [tab, setTab] = useState('content')
  const [overview, setOverview] = useState({})
  const [players, setPlayers] = useState([])
  const [rewards, setRewards] = useState([])
  const emptySubject = { name: '', description: '', icon: 'auto_stories', accent: '#2877bd' }
  const emptyReward = { name: '', category: 'sticker', asset: 'stars', description: '', unlock_xp: 10, active: true }
  const [subjectForm, setSubjectForm] = useState(emptySubject)
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [rewardForm, setRewardForm] = useState(emptyReward)
  const [editingRewardId, setEditingRewardId] = useState(null)
  const [error, setError] = useState('')

  const refreshSubjects = async () => {
    const result = await api('/admin/subjects', token)
    setSubjects(result.subjects)
    if (selected) setSelected(result.subjects.find((subject) => subject.id === selected.id) || null)
  }

  const refreshPlayers = async () => setPlayers((await api('/admin/players', token)).players)
  const refreshRewards = async () => setRewards((await api('/admin/rewards', token)).rewards)

  useEffect(() => {
    Promise.all([
      api('/admin/overview', token).then(setOverview),
      refreshSubjects(),
      refreshPlayers(),
      refreshRewards(),
    ]).catch((err) => setError(err.message))
  }, [token])

  useEffect(() => {
    if (!selected) { setActivities([]); return }
    api(`/admin/subjects/${selected.id}/activities`, token).then((result) => setActivities(result.activities)).catch((err) => setError(err.message))
  }, [selected?.id, token])

  const saveSubject = async (event) => {
    event.preventDefault()
    try {
      const result = await api(editingSubjectId ? `/admin/subjects/${editingSubjectId}` : '/admin/subjects', token, {
        method: editingSubjectId ? 'PATCH' : 'POST',
        body: JSON.stringify(subjectForm),
      })
      setSubjectForm(emptySubject)
      setEditingSubjectId(null)
      await refreshSubjects()
      if (selected?.id === result.subject.id) setSelected(result.subject)
    } catch (err) { setError(err.message) }
  }

  const toggleSubject = async (subject) => {
    try {
      await api(`/admin/subjects/${subject.id}`, token, { method: 'PATCH', body: JSON.stringify({ active: !subject.active }) })
      await refreshSubjects()
    } catch (err) { setError(err.message) }
  }

  const deleteSubject = async (subject) => {
    if (!window.confirm(`¿Eliminar “${subject.name}” y sus actividades?`)) return
    try {
      await api(`/admin/subjects/${subject.id}`, token, { method: 'DELETE' })
      if (selected?.id === subject.id) { setSelected(null); setActivities([]) }
      await refreshSubjects()
    } catch (err) { setError(err.message) }
  }

  const toggleActivity = async (activity) => {
    try {
      const result = await api(`/admin/activities/${activity.id}`, token, { method: 'PATCH', body: JSON.stringify({ active: !activity.active }) })
      setActivities((current) => current.map((item) => item.id === activity.id ? result.activity : item))
    } catch (err) { setError(err.message) }
  }

  const deleteActivity = async (activity) => {
    if (!window.confirm(`¿Eliminar “${activity.title}”?`)) return
    try {
      await api(`/admin/activities/${activity.id}`, token, { method: 'DELETE' })
      setActivities((current) => current.filter((item) => item.id !== activity.id))
    } catch (err) { setError(err.message) }
  }

  const saveReward = async (event) => {
    event.preventDefault()
    try {
      await api(editingRewardId ? `/admin/rewards/${editingRewardId}` : '/admin/rewards', token, {
        method: editingRewardId ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...rewardForm, unlock_xp: Number(rewardForm.unlock_xp) }),
      })
      setRewardForm(emptyReward)
      setEditingRewardId(null)
      await refreshRewards()
    } catch (err) { setError(err.message) }
  }

  const toggleSubscription = async (player, active) => {
    try {
      await api(`/admin/players/${player.id}/subscription`, token, { method: 'PATCH', body: JSON.stringify({ active }) })
      await refreshPlayers()
      setOverview((current) => ({ ...current, subscribers: Math.max(0, (current.subscribers || 0) + (active ? 1 : -1)) }))
    } catch (err) { setError(err.message) }
  }

  const removeReward = async (reward) => {
    if (!window.confirm(`¿Eliminar la personalización “${reward.name}”?`)) return
    try {
      await api(`/admin/rewards/${reward.id}`, token, { method: 'DELETE' })
      await refreshRewards()
    } catch (err) { setError(err.message) }
  }

  return (
    <main className="admin-workspace">
      <header className="admin-topbar"><div className="brand-group"><div className="brand-mark">A</div><div><div className="eyebrow">AVENTUM · ADMINISTRACIÓN</div><h1>Centro de control</h1></div></div><button className="quiet-button" onClick={onLogout}>Cerrar sesión</button></header>
      <section className="admin-metrics" aria-label="Resumen de la plataforma">
        {[['Jugadores', overview.players], ['Suscripciones activas', overview.subscribers], ['Materias activas', overview.active_subjects], ['Retos activos', overview.active_activities], ['Personalizaciones', overview.rewards]].map(([label, value]) => <div className="admin-metric" key={label}><strong>{value ?? '…'}</strong><span>{label}</span></div>)}
      </section>
      <nav className="admin-tabs" aria-label="Administración">
        {[["content", 'Materias y actividades'], ['players', 'Jugadores y ranking'], ['subscriptions', 'Suscripciones'], ['rewards', 'Personalizaciones']].map(([key, label]) => <button type="button" className={tab === key ? 'active' : ''} key={key} onClick={() => { setTab(key); setError('') }}>{label}</button>)}
      </nav>
      {error && <p className="kids-error" role="alert">{error}</p>}
      {tab === 'content' && <div className="admin-columns">
        <section className="admin-column">
          <form className="admin-editor compact-editor" onSubmit={saveSubject}><div><span className="kids-eyebrow">BIBLIOTECA DE CONTENIDO</span><h2>{editingSubjectId ? 'Editar materia' : 'Nueva materia'}</h2></div><label>Nombre<input required value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} /></label><label>Descripción<input value={subjectForm.description} onChange={(event) => setSubjectForm({ ...subjectForm, description: event.target.value })} /></label><div className="editor-grid"><label>Icono<input value={subjectForm.icon} onChange={(event) => setSubjectForm({ ...subjectForm, icon: event.target.value })} /></label><label>Color<input type="color" value={subjectForm.accent} onChange={(event) => setSubjectForm({ ...subjectForm, accent: event.target.value })} /></label></div><div className="admin-form-actions"><button className="kids-primary-button">{editingSubjectId ? 'Guardar materia' : 'Crear materia'}</button>{editingSubjectId && <button type="button" className="quiet-button" onClick={() => { setSubjectForm(emptySubject); setEditingSubjectId(null) }}>Cancelar</button>}</div></form>
          <h2 className="list-heading">Materias <span>{subjects.length}</span></h2>
          <div className="admin-subject-list">{subjects.map((subject) => <article className="admin-subject-entry" key={subject.id}><button className={`admin-subject-row ${selected?.id === subject.id ? 'selected' : ''}`} onClick={() => { setSelected(subject); setEditing(null) }}><span className="subject-dot" style={{ background: subject.accent }}>{subject.icon === 'schedule' ? '⌛' : subject.icon === 'rocket_launch' ? '🚀' : '📚'}</span><span className="subject-row-copy"><strong>{subject.name}</strong><small>{subject.activities_count} actividades · {subject.active ? 'Activa' : 'Pausada'}</small></span></button><div className="row-controls"><button onClick={() => { setSubjectForm({ name: subject.name, description: subject.description || '', icon: subject.icon, accent: subject.accent }); setEditingSubjectId(subject.id) }}>Editar</button><button onClick={() => toggleSubject(subject)}>{subject.active ? 'Pausar' : 'Activar'}</button><button onClick={() => deleteSubject(subject)}>Eliminar</button></div></article>)}</div>
        </section>
        <section className="admin-column activity-column">
          {selected ? <>
            <div className="admin-selection"><div><span className="kids-eyebrow">MATERIA SELECCIONADA</span><h2>{selected.name}</h2><p>{selected.description}</p></div><button className="kids-primary-button" onClick={() => setEditing({ create: true })}>+ Nueva actividad</button></div>
            {editing && <ActivityForm key={editing.id || 'create'} initial={editing.create ? null : editing} subject={selected} token={token} onCancel={() => setEditing(null)} onSaved={(activity) => { setActivities((current) => editing.create ? [...current, activity] : current.map((item) => item.id === activity.id ? activity : item)); setEditing(null); refreshSubjects() }} />}
            <div className="activity-admin-list">{activities.map((activity) => <article className={`activity-admin-row ${activity.active ? '' : 'inactive'}`} key={activity.id}><div className="activity-type-mark">{activity.type === 'sumador' ? '＋' : activity.type === 'sopa' ? 'A' : '✎'}</div><div className="activity-row-copy"><strong>{activity.title}</strong><span>{activity.type} · {activity.active ? 'Disponible para jugar' : 'Pausada'}</span></div><div className="row-controls"><button title="Editar actividad" onClick={() => setEditing(activity)}>Editar</button><button title={activity.active ? 'Pausar actividad' : 'Activar actividad'} onClick={() => toggleActivity(activity)}>{activity.active ? 'Pausar' : 'Activar'}</button><button title="Eliminar actividad" onClick={() => deleteActivity(activity)}>Eliminar</button></div></article>)}</div>
          </> : <div className="admin-empty"><span>📚</span><h2>Elige una materia</h2><p>Selecciona una materia para revisar sus retos o agregar una actividad nueva.</p></div>}
        </section>
      </div>}
      {tab === 'players' && <section className="admin-table-section"><div className="admin-section-title"><div><span className="kids-eyebrow">PROGRESO</span><h2>Ranking de jugadores</h2></div><span>{players.length} cuentas</span></div><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>#</th><th>Jugador</th><th>Correo familiar</th><th>Experiencia</th><th>Vidas</th><th>Plan</th></tr></thead><tbody>{players.map((player, index) => <tr key={player.id}><td>{index + 1}</td><td><strong>{player.name}</strong></td><td>{player.email}</td><td>{player.total_xp || 0} XP</td><td>{player.lives}/7</td><td>{player.premium_until && new Date(player.premium_until) > new Date() ? 'Aventurero activo' : 'Explorador'}</td></tr>)}</tbody></table></div></section>}
      {tab === 'subscriptions' && <section className="admin-table-section"><div className="admin-section-title"><div><span className="kids-eyebrow">PLAN AVENTURERO</span><h2>Suscripciones</h2></div><span>{overview.subscribers || 0} activas</span></div><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Jugador</th><th>Correo familiar</th><th>Estado</th><th>Vence</th><th>Vidas</th><th>Acción</th></tr></thead><tbody>{players.map((player) => { const active = player.premium_until && new Date(player.premium_until) > new Date(); return <tr key={player.id}><td><strong>{player.name}</strong></td><td>{player.email}</td><td>{active ? 'Activa' : 'Sin plan'}</td><td>{active ? new Date(player.premium_until).toLocaleDateString() : '—'}</td><td>{player.lives}/7</td><td><button className="admin-action-button" onClick={() => toggleSubscription(player, !active)}>{active ? 'Cancelar plan' : 'Activar 30 días'}</button></td></tr> })}</tbody></table></div></section>}
      {tab === 'rewards' && <div className="admin-rewards-layout"><form className="admin-editor" onSubmit={saveReward}><div><span className="kids-eyebrow">CATÁLOGO DEL JUGADOR</span><h2>{editingRewardId ? 'Editar personalización' : 'Nueva personalización'}</h2></div><label>Nombre<input required maxLength="100" value={rewardForm.name} onChange={(event) => setRewardForm({ ...rewardForm, name: event.target.value })} /></label><label>Categoría<select value={rewardForm.category} onChange={(event) => setRewardForm({ ...rewardForm, category: event.target.value })}><option value="sticker">Compañero</option><option value="glasses">Lentes</option><option value="aura">Aura</option><option value="uniform">Uniforme</option><option value="rank">Rango</option></select></label><label>Identificador del recurso<input required value={rewardForm.asset} onChange={(event) => setRewardForm({ ...rewardForm, asset: event.target.value })} /></label><label>Descripción<input required maxLength="180" value={rewardForm.description} onChange={(event) => setRewardForm({ ...rewardForm, description: event.target.value })} /></label><label>XP para desbloquear<input required type="number" min="0" value={rewardForm.unlock_xp} onChange={(event) => setRewardForm({ ...rewardForm, unlock_xp: event.target.value })} /></label><div className="admin-form-actions"><button className="kids-primary-button">{editingRewardId ? 'Guardar cambios' : 'Crear personalización'}</button>{editingRewardId && <button type="button" className="quiet-button" onClick={() => { setRewardForm(emptyReward); setEditingRewardId(null) }}>Cancelar</button>}</div></form><section className="admin-table-section"><div className="admin-section-title"><div><span className="kids-eyebrow">CATÁLOGO</span><h2>Personalizaciones</h2></div><span>{rewards.length}</span></div><div className="admin-reward-list">{rewards.map((reward) => <article className="admin-reward-row" key={reward.id}><span className="reward-picture">{({ sticker: '🦉', glasses: '🥽', aura: '✨', uniform: '🧥', rank: '🏅' })[reward.category] || '🎁'}</span><div><strong>{reward.name}</strong><small>{reward.category} · {reward.unlock_xp} XP · {reward.users_count || 0} desbloqueos · {reward.active ? 'Activa' : 'Pausada'}</small></div><div className="row-controls"><button onClick={() => { setRewardForm({ name: reward.name, category: reward.category, asset: reward.asset, description: reward.description, unlock_xp: reward.unlock_xp, active: reward.active }); setEditingRewardId(reward.id) }}>Editar</button><button onClick={async () => { try { await api(`/admin/rewards/${reward.id}`, token, { method: 'PATCH', body: JSON.stringify({ active: !reward.active }) }); await refreshRewards() } catch (err) { setError(err.message) } }}>{reward.active ? 'Pausar' : 'Activar'}</button><button onClick={() => removeReward(reward)}>Eliminar</button></div></article>)}</div></section></div>}
    </main>
  )
}

function ActivityChallenge({ activity, subject, index, total, answer, setAnswer, feedback, onSubmit }) {
  const [secondsLeft, setSecondsLeft] = useState(activity.content?.seconds || 20)
  const [memoryCards, setMemoryCards] = useState([])
  const [turnedCards, setTurnedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [foundPairs, setFoundPairs] = useState([])

  useEffect(() => {
    const cards = (activity.content?.cards || []).map((value, id) => ({ id, value })).sort(() => Math.random() - 0.5)
    setMemoryCards(cards)
    setTurnedCards([])
    setMatchedCards([])
    setFoundPairs([])
    setAnswer('')
    setSecondsLeft(activity.content?.seconds || 20)
  }, [activity.id])

  useEffect(() => {
    if (activity.type !== 'tiempo') return undefined
    let remaining = activity.content?.seconds || 20
    setSecondsLeft(remaining)
    const timer = setInterval(() => {
      remaining -= 1
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        onSubmit('__TIME_UP__')
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [activity.id, activity.type])

  const turnCard = (card) => {
    if (turnedCards.length === 2 || matchedCards.includes(card.id) || turnedCards.includes(card.id)) return
    if (!turnedCards.length) {
      setTurnedCards([card.id])
      return
    }
    const first = memoryCards.find((item) => item.id === turnedCards[0])
    const nextTurned = [...turnedCards, card.id]
    setTurnedCards(nextTurned)
    if (first?.value === card.value) {
      const nextMatched = [...matchedCards, first.id, card.id]
      const nextPairs = [...foundPairs, card.value]
      setMatchedCards(nextMatched)
      setFoundPairs(nextPairs)
      if (nextMatched.length === memoryCards.length) onSubmit(JSON.stringify(nextPairs))
      else setTimeout(() => setTurnedCards([]), 500)
    } else {
      setTimeout(() => setTurnedCards([]), 800)
    }
  }

  const icon = { sumador: '🔢', sopa: '🔤', crucigrama: '✏️', memorama: '🧠', tiempo: '⏱️', adivina: '🕵️' }[activity.type]
  const isMemory = activity.type === 'memorama'

  return (
    <section className="kid-game">
      <div className="game-card-top"><span>{subject?.name} · Reto {index + 1} de {total}</span><span>{icon}</span></div>
      <h2>{activity.title}</h2>
      <p>{activity.prompt}</p>
      {activity.type === 'sumador' && <><div className="math-challenge"><span>{activity.content?.numbers?.[0] ?? '?'} {activity.content?.operator === 'x' ? '×' : '+'} {activity.content?.numbers?.[1] ?? '?'}</span><b>=</b><strong>{answer || '?'}</strong></div><div className="kid-answer-options">{(activity.content?.options || []).map((option) => <button className={answer === option ? 'picked' : ''} key={option} onClick={() => setAnswer(option)}>{option}</button>)}</div></>}
      {activity.type === 'sopa' && <><p className="word-target">Encuentra: <strong>{activity.content?.word}</strong></p><div className="kid-letter-grid">{(activity.content?.grid || []).map((letter, letterIndex) => <button key={`${letterIndex}-${letter}`} className={answer.includes(letter) ? 'picked' : ''} onClick={() => setAnswer((value) => `${value}${letter}`)}>{letter}</button>)}</div><button className="quiet-button" onClick={() => setAnswer('')}>Borrar letras</button><p className="word-target">Tu palabra: <strong>{answer || '____'}</strong></p></>}
      {activity.type === 'crucigrama' && <><div className="kid-clue"><strong>PISTA</strong>{activity.content?.clue}</div><input className="kid-word-input" value={answer} onChange={(event) => setAnswer(event.target.value.toUpperCase())} placeholder="Escribe tu respuesta" /></>}
      {isMemory && <><div className="memory-grid">{memoryCards.map((card) => { const revealed = turnedCards.includes(card.id) || matchedCards.includes(card.id); return <button key={card.id} className={`memory-card ${revealed ? 'revealed' : ''} ${matchedCards.includes(card.id) ? 'matched' : ''}`} onClick={() => turnCard(card)} aria-label={revealed ? `Tarjeta ${card.value}` : 'Voltear tarjeta'}>{revealed ? card.value : '?'}</button> })}</div><p className="memory-score">Parejas encontradas: {foundPairs.length} / {memoryCards.length / 2}</p></>}
      {activity.type === 'tiempo' && <><div className={`timer-readout ${secondsLeft <= 5 ? 'urgent' : ''}`}>⏱ {secondsLeft} s</div>{activity.content?.numbers && <div className="math-challenge"><span>{activity.content.numbers[0]} {activity.content.operator === 'x' ? '×' : '+'} {activity.content.numbers[1]}</span><b>=</b><strong>{answer || '?'}</strong></div>}<div className="kid-answer-options">{(activity.content?.options || []).map((option) => <button className={answer === option ? 'picked' : ''} key={option} disabled={secondsLeft === 0} onClick={() => setAnswer(option)}>{option}</button>)}</div></>}
      {activity.type === 'adivina' && <><div className="kid-clue"><strong>PISTA</strong>{activity.hint || 'Lee la instrucción y adivina.'}</div><input className="kid-word-input" value={answer} onChange={(event) => setAnswer(event.target.value.toUpperCase())} placeholder={activity.content?.placeholder || 'Escribe tu respuesta'} autoComplete="off" /></>}
      {activity.hint && !['crucigrama', 'adivina'].includes(activity.type) && <div className="kid-hint">💡 {activity.hint}</div>}
      {!isMemory && <button className="kids-primary-button" onClick={() => onSubmit()} disabled={activity.type === 'tiempo' && secondsLeft === 0}>Comprobar respuesta</button>}
      <p className="kid-feedback" role="status">{feedback || (isMemory ? 'Voltea tarjetas y encuentra todas las parejas.' : activity.type === 'tiempo' ? '¡Responde antes de que llegue a cero!' : '¡Tú puedes!')}</p>
    </section>
  )
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState(null)
  const [activities, setActivities] = useState([])
  const [activityIndex, setActivityIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [view, setView] = useState('play')
  const [progress, setProgress] = useState({})
  const [lives, setLives] = useState(null)
  const [ranking, setRanking] = useState([])
  const [rewards, setRewards] = useState([])
  const [totalXp, setTotalXp] = useState(0)
  const [equippedCustomizations, setEquippedCustomizations] = useState({})
  const [error, setError] = useState('')

  const loadStudent = async (currentToken) => {
    const [subjectData, progressData, livesData, rankingData, rewardData] = await Promise.all([
      api('/subjects', currentToken), api('/progress', currentToken), api('/lives', currentToken), api('/ranking', currentToken), api('/rewards', currentToken),
    ])
    setSubjects(subjectData.subjects)
    setProgress(progressData.progress || {})
    setLives(livesData)
    setRanking(rankingData.ranking || [])
    setRewards(rewardData.rewards || [])
    setTotalXp(rewardData.total_xp || 0)
    setEquippedCustomizations(rewardData.equipped_customizations || {})
    if (!subjectData.subjects.length) setError('Todavía no hay materias activas. Vuelve pronto.')
  }

  useEffect(() => {
    if (!token) return undefined

    let active = true
    api('/auth/me', token).then(async ({ user: account }) => {
      if (!active) return
      localStorage.setItem('auth_user', JSON.stringify(account))
      setUser(account)
      setView(account.role === 'admin' ? 'admin' : 'play')
      if (account.role !== 'admin') await loadStudent(token)
    }).catch((err) => {
      if (active) setError(err.message)
    })

    return () => { active = false }
  }, [token])

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !token || !user || user.role === 'admin') return

    let active = true
    const listeners = []
    const refresh = () => loadStudent(token).catch((err) => setError(err.message))

    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) refresh()
    }).then((listener) => {
      if (active) listeners.push(listener)
      else listener.remove()
    })

    CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      if (url.startsWith('aventumkids://stripe-return')) refresh()
    }).then((listener) => {
      if (active) listeners.push(listener)
      else listener.remove()
    })

    return () => {
      active = false
      listeners.forEach((listener) => listener.remove())
    }
  }, [token, user?.id])

  const signIn = (account, accountToken) => {
    localStorage.setItem('auth_user', JSON.stringify(account))
    localStorage.setItem('auth_token', accountToken)
    setUser(account)
    setToken(accountToken)
    setView(account.role === 'admin' ? 'admin' : 'play')
  }

  const logout = async () => {
    try { await api('/auth/logout', token, { method: 'POST' }) } catch {}
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
    setToken(null)
    setView('play')
  }

  const selectSubject = async (nextSubject) => {
    setSubject(nextSubject)
    setAnswer('')
    setFeedback('')
    setActivityIndex(0)
    try {
      const result = await api(`/subjects/${nextSubject.id}/activities`, token)
      setActivities(result.activities)
      if (!result.activities.length) setFeedback('Esta materia pronto tendrá nuevos retos.')
    } catch (err) { setError(err.message) }
  }

  const current = activities[activityIndex]
  const submitAnswer = async (submittedAnswer = answer) => {
    if (!current || (!submittedAnswer.trim() && submittedAnswer !== '__TIME_UP__')) { setFeedback('Elige o escribe una respuesta para continuar.'); return }
    if (lives && !lives.unlimited && lives.lives < 1) { setFeedback('No quedan vidas. Revisa el plan para continuar.'); return }
    try {
      const result = await api(`/activities/${current.id}/answer`, token, { method: 'POST', body: JSON.stringify({ answer: submittedAnswer }) })
      if (!result.correct) {
        setFeedback(result.lives === 0 ? 'Se acabaron tus vidas por ahora.' : submittedAnswer === '__TIME_UP__' ? '¡Se acabó el tiempo! Perdiste una vida.' : '¡Casi! Prueba otra vez; perdiste una vida.')
        setAnswer('')
        await loadStudent(token)
        return
      }
      setFeedback(`¡Correcto! Ganaste 10 XP.${result.new_rewards?.length ? ` Desbloqueaste ${result.new_rewards[0].name}.` : ''}`)
      setAnswer('')
      await loadStudent(token)
      setActivityIndex((index) => (index + 1) % activities.length)
    } catch (err) { setFeedback(err.message) }
  }

  const buyPlan = async () => {
    setError('')
    try {
      const result = await api('/billing/checkout', token, { method: 'POST' })
      window.location.assign(result.url)
    } catch (err) { setError(err.message) }
  }

  const equip = async (reward) => {
    try {
      const result = await api(`/rewards/${reward.id}/equip`, token, { method: 'PUT' })
      setEquippedCustomizations(result.equipped_customizations)
    } catch (err) { setError(err.message) }
  }

  if (!token || !user) return <AuthView onLogin={signIn} />
  if (user.role === 'admin') return <AdminView token={token} onLogout={logout} />

  const completedTotal = Object.values(progress).reduce((sum, value) => sum + Number(value), 0)
  const rank = rankFor(totalXp)
  const equippedItems = Object.entries(equippedCustomizations).map(([category, rewardId]) => rewards.find((reward) => reward.id === rewardId && reward.category === category)).filter(Boolean)

  return (
    <div className="kids-app">
      <header className="kids-topbar"><div className="brand-group"><div className="brand-mark">A</div><div><div className="eyebrow">AVENTUM KIDS</div><h1>¡Hola, {user.name}!</h1></div></div><div className="kids-top-actions"><span className="kids-life-counter">{lives?.unlimited ? '∞ vidas' : `♥ ${lives?.lives ?? '…'}/${lives?.maximum ?? 7}`}</span><button className="quiet-button" onClick={logout}>Salir</button></div></header>
      {error && <div className="kids-inline-error" role="alert">{error}</div>}
      {lives && !lives.unlimited && lives.lives === 0 && <section className="kids-plan-alert"><div><strong>Te acabaste tus vidas</strong><span>Con el plan aventurero tienes 14 vidas y recompensas premium por 30 días.</span></div><button className="kids-primary-button" onClick={buyPlan}>Ver plan · $120 MXN</button></section>}
      <nav className="kids-nav"><button className={view === 'play' ? 'selected' : ''} onClick={() => setView('play')}>🧩 Jugar</button><button className={view === 'ranking' ? 'selected' : ''} onClick={() => setView('ranking')}>🏆 Ranking</button><button className={view === 'rewards' ? 'selected' : ''} onClick={() => setView('rewards')}>🎒 Recompensas</button><button className={view === 'profile' ? 'selected' : ''} onClick={() => setView('profile')}>🧑 Perfil</button></nav>

      {view === 'play' && <main className="kids-content"><section className="kids-welcome-strip"><span className="welcome-mascot">🧭</span><div><span className="kids-eyebrow">TU PRÓXIMA MISIÓN</span><h2>¿Qué mundo exploramos hoy?</h2><p>{completedTotal} retos superados · {totalXp} XP · {rank}</p></div></section><div className="kids-subject-grid">{subjects.map((item) => <button key={item.id} className={`kids-subject ${subject?.id === item.id ? 'chosen' : ''}`} onClick={() => selectSubject(item)}><span className="subject-emoji" style={{ backgroundColor: `${item.accent}1b` }}>{item.icon === 'rocket_launch' ? '🚀' : item.icon === 'schedule' ? '⏳' : '📚'}</span><span><strong>{item.name}</strong><small>{progress[item.slug] || 0} retos superados · {item.activities_count} disponibles</small></span><span className="subject-arrow">›</span></button>)}</div>{current && <ActivityChallenge key={current.id} activity={current} subject={subject} index={activityIndex} total={activities.length} answer={answer} setAnswer={setAnswer} feedback={feedback} onSubmit={submitAnswer} />}</main>}

      {view === 'ranking' && <main className="kids-content"><section className="kids-section-heading"><span>🏆</span><div><h2>Ranking de jugadores</h2><p>Los exploradores con más experiencia</p></div></section><div className="kids-leaderboard">{ranking.map((player, index) => <div className={`leader-row ${player.id === user.id ? 'me' : ''}`} key={player.id}><strong className="leader-place">{index + 1}</strong><span className="leader-avatar">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🧭'}</span><span className="leader-name"><b>{player.name}</b><small>{rankFor(player.total_xp || 0)}</small></span><strong className="leader-xp">{player.total_xp || 0} XP</strong></div>)}</div></main>}

      {view === 'rewards' && <main className="kids-content"><section className="kids-section-heading"><span>🎒</span><div><h2>Mis personalizaciones</h2><p>Combina accesorios, aura y uniforme.</p></div><strong>{totalXp} XP</strong></section><div className="reward-grid">{rewards.map((reward) => <article className={`reward-tile ${reward.unlocked ? 'unlocked' : 'locked'}`} key={reward.id}><span className="reward-picture">{rewardIcons[reward.category] || '🎁'}</span><strong>{reward.name}</strong><small>{reward.description}</small>{reward.unlocked ? <button className="reward-equip" onClick={() => equip(reward)}>{equippedCustomizations[reward.category] === reward.id ? 'Quitar objeto' : 'Usar objeto'}</button> : <span className="reward-lock">🔒 {reward.unlock_xp} XP</span>}</article>)}</div></main>}

      {view === 'profile' && <main className="kids-content profile-layout"><section className="profile-avatar-panel"><div className="profile-rank-chip">🏅 {rank}</div><div className={`profile-avatar-art ${equippedCustomizations.aura ? 'with-aura' : ''}`}><span className="avatar-person">🧑🏻‍🚀</span>{equippedItems.filter((item) => item.category === 'glasses').map((item) => <span className="avatar-glasses" key={item.id}>{rewardIcons[item.category]}</span>)}{equippedItems.filter((item) => item.category === 'aura').map((item) => <span className="avatar-aura-icon" key={item.id}>{rewardIcons[item.category]}</span>)}<span className="avatar-check">✓</span></div><div className="profile-uniform-chip">🛡 {equippedItems.find((item) => item.category === 'uniform')?.name || 'Uniforme de explorador'}</div></section><section className="profile-details"><span className="kids-eyebrow">MI PERFIL</span><h2>{user.name}</h2><p>{user.email}</p><div className="profile-stat-row"><span>Nivel</span><strong>{Math.floor(totalXp / 30) + 1} · {rank}</strong></div><div className="profile-stat-row"><span>Experiencia</span><strong>{totalXp} XP</strong></div><div className="profile-stat-row"><span>Retos superados</span><strong>{completedTotal}</strong></div><div className="profile-stat-row"><span>Plan</span><strong>{lives?.premium ? 'Aventurero activo' : 'Explorador'}</strong></div><div className="profile-progress"><span style={{ width: `${Math.min(100, totalXp % 30 / 30 * 100)}%` }} /></div><small>Faltan {30 - totalXp % 30} XP para el próximo nivel</small></section></main>}
      {lives && !lives.unlimited && <footer className="kids-subscription-note"><span>Plan Aventurero: 14 vidas, objetos premium y 30 días de beneficios.</span><button className="quiet-button" onClick={buyPlan}>{lives.premium ? 'Renovar plan · $120 MXN' : 'Ver suscripción · $120 MXN'}</button></footer>}
    </div>
  )
}

export default App
