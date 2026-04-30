import { useState } from 'react'

function Login({ onLogin, irARegistro }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function manejarLogin() {
    fetch("http://localhost:8000/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (datos.access_token) {
          localStorage.setItem("token", datos.access_token)
          onLogin()
        } else {
          setError("Email o contraseña incorrectos")
        }
      })
  }

  return (
    <div className="contenedor-auth">
      <div className="formulario-auth">
        <div className="auth-icon">🔐</div>
        <h1 className="titulo-auth">Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>
        {error && <p className="error">{error}</p>}
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
        <button className="boton-agregar" onClick={manejarLogin}>
          Iniciar Sesión
        </button>
        <p className="link-auth">
          ¿No tienes cuenta?{' '}
          <span onClick={irARegistro}>Regístrate</span>
        </p>
      </div>
    </div>
  )
}

export default Login