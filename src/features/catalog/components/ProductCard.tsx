import type { Product } from '../../../types'

const WA_NUMBER = '5491128469228' 
const IG_URL = 'https://www.instagram.com/cheska_arg' 

export default function ProductCard({ product }: { product: Product }) {
  const waMessage = encodeURIComponent(
    `Hola! Me interesa el producto: *${product.name}* - $${product.price}. Esta disponible?`
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cheska-secondary overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden bg-cheska-secondary">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">ðŸŒ¸</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-cheska-accent font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-semibold text-cheska-text mt-1 truncate">{product.name}</h3>
        <p className="text-xs text-cheska-soft mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-cheska-text">${product.price}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
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
        <div className="flex gap-2 mt-3">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1 bg-cheska-bg border border-cheska-secondary text-cheska-text text-xs py-2 rounded-lg hover:opacity-90"
          >
            <img
              src="/whatsapp-svg.svg"
              alt="whatsapp logo"
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            />
            Pedir por WhatsApp
          </a>
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center px-3 bg-cheska-bg border border-cheska-secondary text-white text-xs py-2 rounded-lg hover:opacity-90"
          >
            <img
              src='/instagram-svg.svg'
              alt='instagram logo'
              aria-hidden='true'
              className='h-4 w-4 shrink-0'
            />
          </a>
        </div>
      </div>
    </div>
  )
}
