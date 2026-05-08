import { useNavigate } from 'react-router-dom'
import type { Product } from '../../../types'

const WA_NUMBER = '5491128469228'

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const isOutOfStock = product.stock === 0
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price)

  const waMessage = encodeURIComponent(
    isOutOfStock
      ? `Hola! Queria consultar si vuelve a entrar el producto: *${product.name}*.`
      : `Hola! Me interesa el producto: *${product.name}* - $${formattedPrice}. Esta disponible?`
  )
  const goToDetail = () => navigate(`/products/${product.id}`)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          goToDetail()
        }
      }}
      className="h-full cursor-pointer bg-white rounded-xl sm:rounded-2xl shadow-sm border border-cheska-secondary overflow-hidden hover:shadow-md transition-shadow flex flex-col focus:outline-none focus:ring-2 focus:ring-cheska-accent focus:ring-offset-2"
      aria-label={`Ver detalle de ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-cheska-secondary">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src =
                'https://placehold.co/600x600/E8DED2/7A6F66?text=Imagen+no+disponible'
            }}
            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? 'brightness-50' : ''
            }`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center px-3 text-center text-xs text-cheska-soft ${
              isOutOfStock ? 'brightness-50' : ''
            }`}
          >
            Imagen no disponible.
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cheska-text shadow-sm sm:text-sm">
              Sin stock
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5 sm:p-4 flex flex-1 flex-col">
        <div className="flex min-w-0 items-center justify-between gap-1.5 sm:gap-2">
          <span className="min-w-0 truncate text-[10px] sm:text-xs text-cheska-accent font-medium uppercase tracking-wide opacity-90">
            {product.category}
          </span>
          {product.contenido && (
            <span className="max-w-[4.5rem] shrink-0 truncate rounded-lg border border-cheska-secondary bg-white px-1.5 py-0.5 text-[10px] font-medium text-cheska-text sm:max-w-none sm:px-2 sm:text-xs">
              {product.contenido}
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-cheska-text mt-1 truncate">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base sm:text-xl font-bold text-cheska-text">
              ${formattedPrice}
            </span>
            <span
              className={`ml-auto w-fit shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                product.stock > 1
                  ? 'bg-green-100 text-green-700'
                  : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
            </span>
          </div>
          <div className="flex mt-2 sm:mt-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="flex-1 flex min-w-0 items-center justify-center gap-1 bg-cheska-bg border border-cheska-secondary text-cheska-text text-[11px] sm:text-xs py-1.5 sm:py-2 rounded-lg hover:opacity-90"
            >
              <img
                src="/whatsapp-svg.svg"
                alt="whatsapp logo"
                aria-hidden="true"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
              />
              <span>{isOutOfStock ? 'Consultar' : 'Pedir'}</span>
              <span className="hidden sm:inline">
                {isOutOfStock ? 'reposición' : 'por WhatsApp'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
