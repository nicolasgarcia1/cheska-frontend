import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'
import ProductCard from '../components/ProductCard'

const ALL_CATEGORIES = 'Todo'

const formatCategory = (category: string) =>
  category.replace(/([a-z])([A-Z])/g, '$1 $2')

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)

  useEffect(() => {
    productsApi.getAll().then(setProducts).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFilter(searchParams.get('q') ?? '')
  }, [searchParams])

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  )

  const filtered = products.filter((p) => {
    const normalizedFilter = filter.toLowerCase()
    const matchesText =
      p.name.toLowerCase().includes(normalizedFilter) ||
      p.category.toLowerCase().includes(normalizedFilter)
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || p.category === selectedCategory

    return matchesText && matchesCategory
  })

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cheska-accent" />
      </div>
    )

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory(ALL_CATEGORIES)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === ALL_CATEGORIES
              ? 'border-cheska-text bg-cheska-text text-cheska-secondary'
              : 'border-cheska-secondary bg-white text-cheska-soft hover:text-cheska-text'
          }`}
        >
          Todo
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'border-cheska-text bg-cheska-text text-cheska-secondary'
                : 'border-cheska-secondary bg-white text-cheska-soft hover:text-cheska-text'
            }`}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No se encontraron productos
        </p>
      )}
    </div>
  )
}
