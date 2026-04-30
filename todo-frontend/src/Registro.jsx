import { useState } from 'react'

function Registro({ irALogin }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function manejarRegistro() {
    fetch("http://localhost:8000/Registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (datos.id) {
          irALogin()
        } else {
          setError("Error al registrarse, intenta con otro email")
        }
      })
  }

  return (
    <div className="contenedor-auth">
      <div className="formulario-auth">
        <div className="auth-icon">✨</div>
        <h1 className="titulo-auth">Crear Cuenta</h1>
        <p className="auth-subtitle">Únete y organiza tus tareas</p>
        {error && <p className="error">{error}</p>}
        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="boton-agregar" onClick={manejarRegistro}>
          Crear Cuenta
        </button>
        <p className="link-auth">
          ¿Ya tienes cuenta?{' '}
          <span onClick={irALogin}>Inicia Sesión</span>
        </p>
      </div>
    </div>
  )
}

export default Registro