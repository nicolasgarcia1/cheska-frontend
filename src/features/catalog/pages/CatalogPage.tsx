import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'
import ProductCard from '../components/ProductCard'

const ALL_CATEGORIES = 'Todo'

type SortOption = 'none' | 'price-asc' | 'price-desc' | 'newest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'none', label: 'Sin ordenar' },
  { value: 'newest', label: 'Novedades' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
]

const formatCategory = (category: string) =>
  category.replace(/([a-z])([A-Z])/g, '$1 $2')

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  const filtered = useMemo(() => {
    const normalizedFilter = filter.toLowerCase()
    const filteredProducts = products.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(normalizedFilter) ||
        p.category.toLowerCase().includes(normalizedFilter)
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || p.category === selectedCategory

      return matchesText && matchesCategory
    })

    return [...filteredProducts].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price
      if (sortOption === 'price-desc') return b.price - a.price
      if (sortOption === 'newest') return b.id - a.id
      return 0
    })
  }, [filter, products, selectedCategory, sortOption])

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cheska-accent" />
      </div>
    )

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-cheska-secondary bg-white px-4 py-2 text-sm font-medium text-cheska-text transition-colors hover:opacity-90"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtrar
        </button>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50">
          <style>
            {`
              @keyframes filter-panel-in {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }

              @keyframes filter-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}
          </style>
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/30 [animation:filter-fade-in_140ms_ease-out]"
            aria-label="Cerrar filtros"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl [animation:filter-panel-in_180ms_ease-out]">
            <div className="flex items-center justify-between border-b border-cheska-secondary px-5 py-4">
              <h2 className="text-lg font-semibold text-cheska-text">
                Filtrar y ordenar
              </h2>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-cheska-text hover:bg-cheska-bg"
                aria-label="Cerrar filtros"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <section>
                <h3 className="text-sm font-semibold text-cheska-text">
                  Ordenar por
                </h3>
                <div className="mt-3 grid gap-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-cheska-secondary px-3 py-2 text-sm text-cheska-text"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortOption === option.value}
                        onChange={() => setSortOption(option.value)}
                        className="h-4 w-4 accent-cheska-text"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-sm font-semibold text-cheska-text">
                  Tipo de producto
                </h3>
                <div className="mt-3 grid gap-2">
                  {[ALL_CATEGORIES, ...categories].map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-cheska-secondary px-3 py-2 text-sm text-cheska-text"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 accent-cheska-text"
                      />
                      {category === ALL_CATEGORIES
                        ? ALL_CATEGORIES
                        : formatCategory(category)}
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="border-t border-cheska-secondary p-5">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-lg bg-cheska-text px-4 py-3 text-sm font-medium text-cheska-secondary hover:opacity-90"
              >
                Aplicar
              </button>
            </div>
          </aside>
        </div>
      )}

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
