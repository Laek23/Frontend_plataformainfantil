import { useEffect, useState } from 'react'
import './style.css'

const apiUrl = import.meta.env.VITE_API_URL || '/api'

const worldCards = [
  {
    id: 'matematicas',
    label: 'MATEMÁTICAS',
    title: 'El Planeta de los Números',
    progress: 4,
    color: 'primary',
    icon: 'rocket_launch',
    action: '¡Jugar ahora!',
    accent: '#005ea4',
  },
  {
    id: 'espanol',
    label: 'ESPAÑOL',
    title: 'El Bosque de las Letras',
    progress: 2,
    color: 'tertiary',
    icon: 'auto_stories',
    action: 'Explorar',
    accent: '#1e862d',
  },
  {
    id: 'historia',
    label: 'HISTORIA',
    title: 'La Máquina del Tiempo',
    progress: 1,
    color: 'secondary',
    icon: 'schedule',
    action: 'Viajar',
    accent: '#785900',
  },
]

const stickers = [
  { name: 'Búho Sabio', icon: 'psychology' },
  { name: 'Astronauta', icon: 'rocket_launch' },
  { name: 'Dinosaurio', icon: 'cruelty_free' },
  { name: 'Corona Rey', icon: 'crown' },
]

const missions = [
  { name: 'Conteo Espacial', done: true, stars: 3 },
  { name: 'Suma de Cohetes', done: true, stars: 3 },
  { name: 'Restas Meteorito', done: true, stars: 2 },
  { name: 'Formas Alienígenas', done: true, stars: 3 },
  { name: 'Laberinto de Multiplicar', active: true, stars: 0 },
  { name: 'Patrones de Estrellas', locked: true },
  { name: 'Fracciones de Pizza', locked: true },
  { name: 'Monedas Galácticas', locked: true },
  { name: 'Relojes Solares', locked: true },
  { name: 'Jefe: Titán Números', locked: true },
]

const activities = [
  { id: 'matematicas', subject: 'Matemáticas', value: '95%', tone: 'primary' },
  { id: 'espanol', subject: 'Español', value: '88%', tone: 'secondary' },
  { id: 'historia', subject: 'Historia', value: '100%', tone: 'tertiary' },
]

const weekly = [20, 25, 30, 22, 28, 35, 18]
const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const activitiesBySubject = {
  matematicas: [
    { type: 'sumador', title: 'Sumador de Cohetes', prompt: 'Suma las piezas para lanzar el cohete.', numbers: [4, 3], answer: '7', options: ['6', '7', '8', '9'], hint: '4 + 3 = ?' },
    { type: 'sumador', title: 'Mercado Galáctico', prompt: 'Junta las monedas y descubre el total.', numbers: [6, 2], answer: '8', options: ['7', '8', '9', '10'], hint: '6 + 2 = ?' },
  ],
  espanol: [
    { type: 'sopa', title: 'Sopa de Letras del Bosque', prompt: 'Encuentra la palabra LUNA letra por letra.', word: 'LUNA', grid: ['L', 'A', 'R', 'M', 'U', 'N', 'S', 'T', 'N', 'O', 'P', 'A'], answer: 'LUNA', hint: 'Palabra escondida: LUNA' },
    { type: 'sopa', title: 'Sopa de Animales', prompt: 'Encuentra la palabra OSO en la sopa.', word: 'OSO', grid: ['O', 'B', 'S', 'E', 'R', 'O', 'C', 'A', 'L', 'O', 'S', 'D'], answer: 'OSO', hint: 'Palabra escondida: OSO' },
  ],
  historia: [
    { type: 'crucigrama', title: 'Crucigrama del Tiempo', prompt: 'Completa las casillas con la respuesta de la pista.', clue: 'Ciudad donde nacieron los Juegos Olímpicos antiguos.', answer: 'ATENAS', hint: 'Pista 1 · 6 letras' },
    { type: 'crucigrama', title: 'Crucigrama de Civilizaciones', prompt: 'Completa las casillas con la respuesta de la pista.', clue: 'Construcción egipcia con forma triangular.', answer: 'PIRAMIDE', hint: 'Pista 2 · 8 letras' },
  ],
}

function App() {
  const [age, setAge] = useState('5 a 7 años')
  const [activeSection, setActiveSection] = useState('aventura')
  const [progress, setProgress] = useState({ matematicas: 4, espanol: 2, historia: 1 })
  const [selectedSubject, setSelectedSubject] = useState('matematicas')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [activityIndex, setActivityIndex] = useState({ matematicas: 0, espanol: 0, historia: 0 })
  const [feedback, setFeedback] = useState('')
  const [missionIndex, setMissionIndex] = useState(4)

  useEffect(() => {
    fetch(`${apiUrl}/progress?player_id=mateo`)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el progreso')
        return response.json()
      })
      .then((data) => setProgress(data.progress))
      .catch(() => setFeedback('No se pudo sincronizar el progreso.'))
  }, [])

  const totalProgress = Object.values(progress).reduce((sum, value) => sum + value, 0)
  const activity = activitiesBySubject[selectedSubject][activityIndex[selectedSubject]]
  const scrollTo = (section) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const startSubject = (subject) => {
    setSelectedSubject(subject)
    setSelectedAnswer('')
    setFeedback('')
    scrollTo('reto')
  }
  const submitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback('Completa el juego para continuar.')
      return
    }
    if (selectedAnswer.toUpperCase() === activity.answer) {
      const completed = Math.min(10, progress[selectedSubject] + 1)
      setProgress((current) => ({ ...current, [selectedSubject]: completed }))
      fetch(`${apiUrl}/progress/${selectedSubject}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ player_id: 'mateo', completed }),
      }).catch(() => setFeedback('Actividad superada, pero no se pudo sincronizar el progreso.'))
      setFeedback('¡Excelente! Actividad superada y nueva actividad desbloqueada.')
      setMissionIndex((current) => Math.min(missions.length - 1, current + 1))
      setActivityIndex((current) => ({ ...current, [selectedSubject]: (current[selectedSubject] + 1) % activitiesBySubject[selectedSubject].length }))
      setSelectedAnswer('')
    } else {
      setFeedback('Todavía no. Revisa tu respuesta y vuelve a intentarlo.')
    }
  }

  return (
    <div className="app-shell">
      <main className="platform-screen">
        <header className="topbar">
          <div className="brand-group">
            <div className="brand-mark">A</div>
            <div>
              <div className="eyebrow">Aventum Kids</div>
              <h1>Explora y aprende</h1>
            </div>
          </div>
          <button className="top-action" onClick={() => scrollTo('aventura')}>Hoy</button>
        </header>

        <section className="hero-card" id="aventura">
          <div className="age-switch">
            {['5 a 7 años', '8 a 11 años'].map((option) => (
              <button key={option} className={age === option ? 'active' : ''} onClick={() => setAge(option)}>{option}</button>
            ))}
          </div>

          <div className="welcome-banner">
            <div className="mascot-wrap">
              <div className="mascot" aria-label="mascota educativa" />
              <span className="badge-star">✦</span>
            </div>
            <div className="welcome-copy">
              <div className="welcome-line">
                <span>¡Hola, Mateo!</span>
                <span className="spark">✨</span>
              </div>
              <p>¿Listo para tu aventura de aprendizaje de {age}?</p>
            </div>
          </div>

          <div className="mission-box">
            <div className="mission-icon">🎁</div>
            <div className="mission-copy">
              <span>Misión de hoy</span>
              <strong>Resuelve 3 enigmas matemáticos para ganar un cofre dorado</strong>
            </div>
            <div className="mission-counter">1/3</div>
          </div>
        </section>

        <section className="world-section" id="materias">
          <div className="section-header">
            <div className="title-wrap">
              <span className="material-symbols">map</span>
              <h2>Mundos de Aventura</h2>
            </div>
            <span className="status-pill">3 Zonas</span>
          </div>

          <div className="world-list">
            {worldCards.map((card) => (
              <article className="world-card" key={card.id}>
                <div className="card-top">
                  <div className="card-icon" style={{ background: card.accent }}>
                    <span className="material-symbols">{card.icon}</span>
                  </div>
                  <div className="card-title-wrap">
                    <span className="tiny-label" style={{ color: card.accent }}>{card.label}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <div className="level-pill">Nivel 2</div>
                </div>

                <div className="visual-preview" aria-hidden="true">
                  <div className="planet" />
                  <span className="chip">{card.label === 'MATEMÁTICAS' ? 'Sumas y Restas' : card.label === 'ESPAÑOL' ? 'Vocales y Sílabas' : 'Antiguas Civilizaciones'}</span>
                </div>

                <div className="card-progress">
                  <div className="progress-meta">
                    <span>Actividades: {progress[card.id]} de 10 listas</span>
                    <strong>{progress[card.id] * 10}%</strong>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${progress[card.id] * 10}%`, background: card.accent }} />
                  </div>
                  <button className="play-btn" style={{ background: card.accent }} onClick={() => startSubject(card.id)}>
                    <span className="material-symbols">play_arrow</span>
                    <span>{card.action}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="progress-section" id="progreso">
          <div className="section-header">
            <div className="title-wrap">
              <span className="material-symbols">workspace_premium</span>
              <h2>Tu progreso</h2>
            </div>
            <span className="status-pill muted">Global</span>
          </div>

          <div className="summary-card">
            <div className="summary-head">
              <div className="summary-badge">Nivel 4: Gran Descubridor</div>
              <div className="summary-cup">🏆</div>
            </div>
            <h3>¡Genial viaje de saberes! 🚀</h3>
            <p>Llevas completadas <strong>{totalProgress} de 30</strong> actividades globales.</p>
            <div className="progress-meta">
              <span>Progreso general</span>
              <strong>{Math.round((totalProgress / 30) * 100)}% completado</strong>
            </div>
            <div className="progress-bar large">
              <span style={{ width: `${(totalProgress / 30) * 100}%`, background: '#1e862d' }} />
            </div>
          </div>

          <div className="subject-breakdown">
            {activities.map((item) => (
              <button className="breakdown-card" key={item.subject} onClick={() => startSubject(item.id)}>
                <div className="breakdown-head">
                  <div className="subject-icon" data-tone={item.tone}>
                    <span className="material-symbols">
                      {item.subject === 'Matemáticas' ? 'calculate' : item.subject === 'Español' ? 'menu_book' : 'castle'}
                    </span>
                  </div>
                  <div>
                    <h4>{item.subject}</h4>
                    <p>{progress[item.id]} de 10 actividades</p>
                  </div>
                  <div className="star-badge"><span>★</span>{item.value}</div>
                </div>
                <div className="progress-bar mini">
                  <span style={{ width: `${progress[item.id] * 10}%`, background: item.tone === 'primary' ? '#005ea4' : item.tone === 'secondary' ? '#fdc003' : '#1e862d' }} />
                </div>
              </button>
            ))}
          </div>

          <div className="album-card">
            <div className="album-head">
              <div className="title-wrap">
                <span className="material-symbols">loyalty</span>
                <h3>Álbum de Pegatinas</h3>
              </div>
              <span className="status-pill small">4 / 8 Listas</span>
            </div>
            <div className="stickers-grid">
              {stickers.map((sticker) => (
                <div className="sticker" key={sticker.name}>
                  <div className="sticker-icon"><span className="material-symbols">{sticker.icon}</span></div>
                  <span>{sticker.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-head">
              <div>
                <h3>Minutos de Aventura Semanal</h3>
                <p>Promedio: 25 min al día</p>
              </div>
              <div className="chart-badge">+18%</div>
            </div>
            <div className="chart-bars">
              {weekly.map((value, index) => (
                <div className="bar-col" key={days[index]}>
                  <span className="bar-value">{value}m</span>
                  <div className="bar" style={{ height: `${value}%` }} />
                  <span className="bar-day">{days[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="path-section" id="premios">
          <div className="section-header path-head">
            <div className="title-wrap">
              <span className="material-symbols">calculate</span>
              <h2>Planeta Matemáticas</h2>
            </div>
            <span className="status-pill accent">Capítulo 1</span>
          </div>

          <div className="path-banner">
            <div className="path-badge">5 - 11 años</div>
            <div className="path-subtitle">10 Misiones Estelares</div>
            <div className="path-progress-line">
              <div className="path-progress-meta">
                <span className="material-symbols">verified</span>
                <span>Progreso de Misión</span>
              </div>
              <strong>4 de 10 Superadas (40%)</strong>
            </div>
            <div className="progress-bar large">
              <span style={{ width: '40%', background: '#1e862d' }} />
            </div>
          </div>

          <div className="mission-track">
            {missions.map((mission, index) => {
              const isLocked = index > missionIndex
              const isActive = index === missionIndex
              return (
              <div key={mission.name} className={`track-node ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
                <button className={`node-btn ${isActive ? 'active-btn' : ''}`} disabled={isLocked} onClick={() => { setMissionIndex(index); startSubject('matematicas') }}>
                  <span className="material-symbols">
                    {isActive ? 'grid_view' : isLocked ? 'lock' : 'check'}
                  </span>
                </button>
                {isActive && (
                  <div className="mission-card">
                    <strong>{mission.name}</strong>
                    <p>Tablas mágicas del 2 y del 5</p>
                    <button className="route-cta" onClick={() => startSubject('matematicas')}>¡Comenzar Reto!</button>
                  </div>
                )}
                {!isActive && !isLocked && (
                  <div className="stars-row">
                    {Array.from({ length: mission.stars }).map((_, star) => (
                      <span key={star}>★</span>
                    ))}
                    {Array.from({ length: 3 - mission.stars }).map((_, star) => (
                      <span key={`empty-${star}`} className="empty-star">★</span>
                    ))}
                  </div>
                )}
                <span className="mission-name">{mission.name}</span>
              </div>
              )
            })}
          </div>
        </section>

        <section className="game-section" id="reto">
          <div className="game-header">
            <button className="close-btn" onClick={() => scrollTo('materias')}>✕</button>
            <div className="progress-wrap">
              <div className="progress-topline">
                <span>{activity.title}</span>
                <strong>{progress[selectedSubject] * 10}%</strong>
              </div>
              <div className="progress-bar small">
                <span style={{ width: `${progress[selectedSubject] * 10}%`, background: '#1e862d' }} />
              </div>
            </div>
            <div className="hearts">❤ ❤ ❤</div>
          </div>

          <div className="question-row">
            <div className="mascot-mini" />
            <div className="question-bubble">
              <p>{activity.prompt}</p>
              <div className="question-hint">
                <span>{activity.hint}</span>
                <span className="material-symbols">rocket_launch</span>
              </div>
            </div>
          </div>

          {activity.type === 'sumador' && (
            <>
              <div className="equation-box">
                <div className="equation-card">
                  <div className="mini-icons">🚀 🚀 🚀 🚀</div>
                  <strong>{activity.numbers[0]}</strong>
                </div>
                <div className="plus">+</div>
                <div className="equation-card gold">
                  <div className="mini-icons">★ ★ ★</div>
                  <strong>{activity.numbers[1]}</strong>
                </div>
                <div className="equals">=</div>
                <div className="result-slot">{selectedAnswer || '?'}</div>
              </div>
              <div className="answer-grid">
                {activity.options.map((option) => (
                  <button key={option} className={`answer-btn ${selectedAnswer === option ? 'selected' : ''}`} onClick={() => { setSelectedAnswer(option); setFeedback('') }}>{option}</button>
                ))}
              </div>
            </>
          )}

          {activity.type === 'sopa' && (
            <div className="word-search-game">
              <div className="word-search-grid" aria-label="Sopa de letras">
                {activity.grid.map((letter, index) => (
                  <button key={`${letter}-${index}`} className={`word-letter ${selectedAnswer.includes(letter) ? 'selected' : ''}`} onClick={() => setSelectedAnswer((current) => `${current}${letter}`)}>{letter}</button>
                ))}
              </div>
              <div className="word-search-result">Palabra: <strong>{selectedAnswer || '____'}</strong></div>
              <button className="clear-word" onClick={() => setSelectedAnswer('')}>Limpiar palabra</button>
            </div>
          )}

          {activity.type === 'crucigrama' && (
            <div className="crossword-game">
              <div className="crossword-clue"><span>PISTA</span>{activity.clue}</div>
              <div className="crossword-grid" aria-label="Crucigrama">
                {Array.from({ length: activity.answer.length }).map((_, index) => (
                  <div className="crossword-cell" key={index}>{selectedAnswer[index] || ''}</div>
                ))}
              </div>
              <input className="crossword-input" value={selectedAnswer} maxLength={activity.answer.length} onChange={(event) => setSelectedAnswer(event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} placeholder="Escribe la respuesta" aria-label="Respuesta del crucigrama" />
            </div>
          )}

          <button className="submit-btn" onClick={submitAnswer}>¡COMPROBAR RESPUESTA!</button>
          <div className="celebration">{feedback || 'Completa el reto para avanzar.'}</div>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="Navegación principal">
        <button className={activeSection === 'aventura' ? 'active' : ''} onClick={() => scrollTo('aventura')}>🏕️<span>Aventura</span></button>
        <button className={activeSection === 'materias' ? 'active' : ''} onClick={() => scrollTo('materias')}>📚<span>Materias</span></button>
        <button className={activeSection === 'premios' ? 'active' : ''} onClick={() => scrollTo('premios')}>🏆<span>Premios</span></button>
        <button className={activeSection === 'progreso' ? 'active' : ''} onClick={() => scrollTo('progreso')}>📊<span>Progreso</span></button>
      </nav>
    </div>
  )
}

export default App
