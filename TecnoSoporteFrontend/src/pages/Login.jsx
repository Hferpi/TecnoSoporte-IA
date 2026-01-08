import { useState } from 'react'
import Dashboard from './Dashboard'

function Login() {
  const [user, setUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState('')

  if (!user) {
    return (
      <div className="w-full min-h-dvh flex justify-center items-center bg-gradient-to-br from-slate-900 to-blue-900">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!selectedUser) return
            setUser(selectedUser)
          }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl flex flex-col gap-4"
        >
          <h1 className="text-3xl text-white font-bold text-center">
            Tecno Soporte
          </h1>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-3 rounded-lg"
          >
            <option value="">Usuario:</option>
            <option value="Carlos">Carlos</option>
            <option value="Anna">Anna</option>
            <option value="Sebastian">Sebastian</option>
            <option value="Soporte">Soporte (general)</option>
          </select>

          <input
            type="password"
            className="p-3 rounded-lg"
            placeholder="Clave"
          />

          <button className="bg-cyan-500 hover:bg-cyan-400 py-3 rounded-lg font-semibold">
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />
}

export default Login
