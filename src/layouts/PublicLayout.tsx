import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const WA_NUMBER = '5491128469228'
const IG_URL = 'https://www.instagram.com/cheska_arg'

export default function PublicLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState(searchParams.get('q') ?? '')
  const searchFormRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setSearchText(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => {
    const closeSearchOnOutsideClick = (event: MouseEvent) => {
      if (
        !searchText.trim() &&
        !searchFormRef.current?.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', closeSearchOnOutsideClick)

    return () => {
      document.removeEventListener('mousedown', closeSearchOnOutsideClick)
    }
  }, [searchText])

  const updateSearch = (value: string) => {
    setSearchText(value)

    const nextParams = new URLSearchParams(searchParams)
    if (value.trim()) {
      nextParams.set('q', value)
    } else {
      nextParams.delete('q')
    }

    setSearchParams(nextParams)
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedSearch = searchText.trim()
    navigate(trimmedSearch ? `/?q=${encodeURIComponent(trimmedSearch)}` : '/')
  }

  return (
    <div className="min-h-screen bg-cheska-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-cheska-primary">
        <div className="mx-auto px-4 py-2 flex items-center justify-center bg-cheska-secondary">
          <p className="text-xs font-medium text-cheska-text sm:text-sm">
            Métodos de pago: efectivo/transferencia
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="mr-auto h-full shrink-0"
            aria-label="Ir al inicio"
          >
            <img
              className="h-full w-auto object-contain"
              src="/cheska_logo_navbar.png"
              alt="Cheska"
            />
          </Link>
          <form
            ref={searchFormRef}
            onSubmit={handleSearchSubmit}
            className="flex items-center overflow-hidden"
            role="search"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen((current) => !current)}
              className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                isSearchOpen ? 'translate-x-2' : ''
              }`}
              aria-label="Abrir buscador"
              aria-expanded={isSearchOpen}
            >
              <img
                src="/lupa-svg.svg"
                alt=""
                aria-hidden="true"
                className="h-6 w-6"
              />
            </button>
            <div
              className={`relative transition-all duration-300 ${
                isSearchOpen
                  ? 'ml-2 w-40 opacity-100 sm:w-56'
                  : 'ml-0 w-0 opacity-0'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar..."
                className={`h-10 w-full rounded-full border border-cheska-secondary bg-white px-4 text-sm text-cheska-text outline-none transition-all duration-300 placeholder:text-cheska-soft ${
                  searchText ? 'pr-9' : ''
                } ${isSearchOpen ? '' : 'border-transparent px-0'}`}
                tabIndex={isSearchOpen ? 0 : -1}
              />
              {searchText && isSearchOpen && (
                <button
                  type="button"
                  onClick={() => {
                    updateSearch('')
                    inputRef.current?.focus()
                  }}
                  className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-lg leading-none text-cheska-text hover:opacity-70"
                  aria-label="Borrar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-cheska-primary bg-cheska-secondary">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <img
              className="h-14 w-auto rounded-md object-contain border border-cheska-soft"
              src="/cheska_logo_navbar.png"
              alt="Cheska"
            />
            <p className="mt-3 max-w-md text-sm text-cheska-text">
              Body splash y cremas originales Victoria's Secret.
            </p>
            <p className="mt-0 text-xs text-cheska-text opacity-70">
              © 2026 CHESKA - Desarrollado por{' '}
              <a
                href="https://github.com/nicolasgarcia1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Nicolás García
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="mt-0 text-sm text-cheska-text">
              Seguinos en nuestras redes!
            </p>

            <div className="flex gap-4 sm:gap-6">
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-cheska-text hover:opacity-90"
              >
                <img
                  src="/whatsapp-svg.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
                WhatsApp
              </a>

              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-cheska-text hover:opacity-90"
              >
                <img
                  src="/instagram-svg.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
