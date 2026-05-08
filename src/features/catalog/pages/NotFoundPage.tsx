import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-cheska-text sm:text-4xl">
        Ups! no pudimos encontrar esta página
      </h1>
      <Link
        to="/"
        className="mt-6 rounded-lg border border-cheska-secondary bg-white px-4 py-2 text-sm font-medium text-cheska-text hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
