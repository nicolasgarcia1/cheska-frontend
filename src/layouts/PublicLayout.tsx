import { Outlet } from 'react-router-dom'

const WA_NUMBER = '5491128469228'
const IG_URL = 'https://www.instagram.com/cheska_arg'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-cheska-bg">
      <header className="bg-white shadow-sm border-b border-cheska-primary">
        <div className="mx-auto px-4 py-4 flex items-center justify-between bg-cheska-secondary"></div>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <img className="h-full w-auto shrink-0 object-contain mr-auto" src="/cheska_logo_navbar.png" alt="logo">
          </img>
          <div className="flex gap-4">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              <img
                src="/whatsapp-svg.svg"
                alt="whatsapp logo"
                aria-hidden="true"
                className="h-7 w-7 shrink-0"
              />
            </a>
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              <img
              src='/instagram-svg.svg'
              alt='instagram logo'
              aria-hidden='true'
              className='h-7 w-7 shrink-0'
            />
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
