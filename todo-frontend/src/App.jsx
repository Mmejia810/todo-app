import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Login from './Login'
import Registro from './Registro'

function App() {
  const [tareas, setTareas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [pantalla, setPantalla] = useState('login')

  const token = localStorage.getItem("token")

  const completadas = tareas.filter(tarea => tarea.completada).length
  const pendientes = tareas.filter(tarea => !tarea.completada).length
  const tareasFiltradas = filtro === 'todas'
    ? tareas
    : filtro === 'completadas'
    ? tareas.filter(tarea => tarea.completada)
    : tareas.filter(tarea => !tarea.completada)

  useEffect(() => {
    if (!token) return
    fetch("http://localhost:8000/tareas", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setTareas(datos))
  }, [token])

  function crearTarea() {
    fetch("http://localhost:8000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descripcion, completada: false })
    })
      .then(respuesta => respuesta.json())
      .then(nuevaTarea => {
        setTareas([...tareas, nuevaTarea])
        setTitulo('')
        setDescripcion('')
      })
  }

  function eliminarTarea(id) {
    fetch(`http://localhost:8000/tareas/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(() => setTareas(tareas.filter(tarea => tarea.id !== id)))
  }

  function toggleCompletada(tarea) {
    fetch(`http://localhost:8000/tareas/${tarea.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        completada: !tarea.completada
      })
    })
      .then(respuesta => respuesta.json())
      .then(tareaActualizada => {
        setTareas(tareas.map(t =>
          t.id === tareaActualizada.id ? tareaActualizada : t
        ))
      })
  }

if (pantalla === 'registro') {
  return <Registro irALogin={() => setPantalla('login')} />
}

if (!token || pantalla === 'login') {
  return (
    <Login
      onLogin={() => setPantalla('app')}
      irARegistro={() => setPantalla('registro')}
    />
  )
}
  return (
    <div className="contenedor">
      <div className="header">
        <h1 className="titulo">Mi App de Tareas</h1>
        <button className="boton-logout" onClick={() => {
          localStorage.removeItem("token")
          setPantalla('login')
          setTareas([])
        }}>
          Cerrar Sesión
        </button>
      </div>

      <div className="formulario">
        <input
          className="input"
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <button className="boton-agregar" onClick={crearTarea}>
          Agregar tarea
        </button>
      </div>

      <div className="contador">
        <span className="contador-total">Total: {tareas.length}</span>
        <span className="contador-pendientes">⏳ Pendientes: {pendientes}</span>
        <span className="contador-completadas">✅ Completadas: {completadas}</span>
      </div>

      <div className="filtros">
        <button
          className={filtro === 'todas' ? 'filtro-activo' : 'filtro'}
          onClick={() => setFiltro('todas')}
        >
          Todas
        </button>
        <button
          className={filtro === 'pendientes' ? 'filtro-activo' : 'filtro'}
          onClick={() => setFiltro('pendientes')}
        >
          Pendientes
        </button>
        <button
          className={filtro === 'completadas' ? 'filtro-activo' : 'filtro'}
          onClick={() => setFiltro('completadas')}
        >
          Completadas
        </button>
      </div>

      <AnimatePresence>
        {tareasFiltradas.length === 0 ? (
          <motion.div
  className="vacio"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  <div className="vacio-icono">📋</div>
  <p>No hay tareas aquí</p>
  <p>¡Agrega una para comenzar!</p>
</motion.div>
        ) : (
          <ul className="lista">
            <AnimatePresence>
              {tareasFiltradas.map(tarea => (
                <motion.li
  key={tarea.id}
  className={`tarea ${tarea.completada ? 'tarea-completada-card' : ''}`}
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 50 }}
  transition={{ duration: 0.3 }}
>
  <div className="tarea-info">
    <span className={`tarea-titulo ${tarea.completada ? 'tarea-titulo-completada' : ''}`}>
      {tarea.titulo}
    </span>
    <span className="descripcion">{tarea.descripcion}</span>
  </div>
  <div className="tarea-botones">
    <button
      className={tarea.completada ? 'boton-deshacer' : 'boton-completar'}
      onClick={() => toggleCompletada(tarea)}
    >
      {tarea.completada ? '↩ Deshacer' : '✓ Completar'}
    </button>
    <button
      className="boton-eliminar"
      onClick={() => eliminarTarea(tarea.id)}
    >
      🗑 Eliminar
    </button>
  </div>
</motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App