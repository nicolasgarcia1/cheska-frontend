import { useEffect, useState } from 'react'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'
import ProductCard from '../components/ProductCard'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    productsApi.getAll().then(setProducts).finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.category.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    )

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cheska-text mb-2">Nuestros Productos</h2>
        <p className="text-cheska-soft">Body splash y cremas originales Victoria's Secret</p>
      </div>
      <input
        type="text"
        placeholder="Buscar producto..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full max-w-sm mb-6 px-4 py-2 border border-cheska-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-cheska-primary"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No se encontraron productos</p>
      )}
    </div>
  )
}
