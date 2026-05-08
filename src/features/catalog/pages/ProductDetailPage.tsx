import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'

const WA_NUMBER = '5491128469228'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const productId = Number(id)

    if (!Number.isFinite(productId)) {
      setError(true)
      setLoading(false)
      return
    }

    productsApi
      .getById(productId)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-cheska-accent" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
        <p className="text-cheska-text">No encontramos este producto.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg border border-cheska-secondary bg-white px-4 py-2 text-sm font-medium text-cheska-text hover:opacity-90"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price)
  const isOutOfStock = product.stock === 0
  const waMessage = encodeURIComponent(
    isOutOfStock
      ? `Hola! Queria consultar si vuelve a entrar el producto: *${product.name}*.`
      : `Hola! Me interesa el producto: *${product.name}* - $${formattedPrice}. Esta disponible?`
  )

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-cheska-secondary bg-cheska-secondary">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src =
                'https://placehold.co/800x800/E8DED2/7A6F66?text=Imagen+no+disponible'
            }}
            className={`h-full w-full object-cover ${
              isOutOfStock ? 'brightness-50' : ''
            }`}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center px-4 text-center text-sm text-cheska-soft ${
              isOutOfStock ? 'brightness-50' : ''
            }`}
          >
            Imagen no disponible.
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cheska-text shadow-sm sm:text-base">
              Sin stock
            </span>
          </div>
        )}
      </div>

      <section className="flex flex-col gap-4">
        <Link
          to="/"
          className="w-fit text-sm font-medium text-cheska-soft hover:text-cheska-text"
        >
          Volver al catálogo
        </Link>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-cheska-accent">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-cheska-text">
            {product.name}
          </h1>
        </div>

        {product.description && (
          <p className="text-base leading-7 text-cheska-text">
            {product.description}
          </p>
        )}

        {product.contenido && (
          <p className="text-sm font-medium text-cheska-text">
            Contenido: {product.contenido}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-cheska-text">
            ${formattedPrice}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-sm ${
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

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cheska-secondary bg-white px-4 py-3 text-sm font-medium text-cheska-text hover:opacity-90 sm:w-fit"
        >
          <img
            src="/whatsapp-svg.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
          />
          {isOutOfStock ? 'Consultar reposición' : 'Pedir por WhatsApp'}
        </a>
      </section>
    </div>
  )
}
