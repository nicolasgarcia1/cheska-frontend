import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { authApi } from '../../../api/authApi'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const inputClassName =
    'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus-visible:outline-none focus-visible:border-cheska-primary focus-visible:ring-2 focus-visible:ring-cheska-primary'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await authApi.login({ username, password })
      login(data.token)
      navigate('/admin')
    } catch {
      toast.error('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF4F0] flex items-center justify-center">
      <div className="bg-cheska-bg p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-cheska-text mb-1">Acceso Admin</h1>
        <p className="text-gray-500  text-sm mb-6">Panel de gestión Cheska</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cheska-soft text-white py-2.5 rounded-xl font-medium hover:bg-cheska-primary transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheska-primary focus-visible:ring-offset-2"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
