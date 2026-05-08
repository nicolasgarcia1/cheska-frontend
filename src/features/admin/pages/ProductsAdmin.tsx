import { useEffect, useState } from 'react'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'
import ProductForm from '../components/ProductForm'
import ReplenishStockForm from '../components/ReplenishStockForm'
import { ChevronDown, PackagePlus, Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [replenishing, setReplenishing] = useState<Product | null>(null)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)
  const [error, setError] = useState(false)

  const load = () =>
    productsApi
      .getAllAdmin()
      .then((data) => {
        setProducts(data)
        setError(false)
      })
      .catch(() => setError(true))
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'ADVERTENCIA!',
      text: 'Esta acción elimina para siempre el producto, si lo que querés es darlo de baja editalo y desmarcá la opción "Activo".',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#7A6F66',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    await productsApi.delete(id)
    toast.success('Producto eliminado')
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-cheska-soft text-white px-4 py-2 rounded-xl hover:bg-cheska-accent text-sm"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          No pudimos cargar los productos. Probá recargar la página.
        </div>
      )}

      <div className="space-y-3 md:hidden">
        {products.map((p) => {
          const isExpanded = expandedProductId === p.id

          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedProductId(isExpanded ? null : p.id)
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-expanded={isExpanded}
                >
                  <img
                    src={
                      p.imageUrl ||
                      'https://placehold.co/48x48/fce7f3/f43f5e?text=Ch'
                    }
                    alt={p.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://placehold.co/48x48/fce7f3/f43f5e?text=Ch'
                    }}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Tocar para ver detalle
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setReplenishing(p)}
                  className="shrink-0 rounded-lg p-2 text-cheska-text hover:bg-cheska-soft"
                  aria-label={`Reponer stock de ${p.name}`}
                >
                  <PackagePlus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(p)
                    setShowForm(true)
                  }}
                  className="shrink-0 rounded-lg p-2 text-cheska-text hover:bg-cheska-soft"
                  aria-label={`Editar ${p.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="shrink-0 rounded-lg p-2 text-cheska-text hover:bg-cheska-soft"
                  aria-label={`Eliminar ${p.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Contenido</p>
                    <p className="font-medium text-gray-700">
                      {p.contenido || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Categoría</p>
                    <p className="font-medium text-gray-700">{p.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Precio</p>
                    <p className="font-medium text-gray-700">${p.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Costo</p>
                    <p className="font-medium text-gray-700">${p.cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Margen</p>
                    <p className="font-medium text-gray-700">
                      {p.profitMargin?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Stock</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${
                        p.stock > 1
                          ? 'bg-green-100 text-green-700'
                          : p.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Estado</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${
                        p.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Imagen', 'Nombre', 'Contenido', 'Precio', 'Costo', 'Margen', 'Stock', 'Estado', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={p.imageUrl || 'https://placehold.co/40x40/fce7f3/f43f5e?text=ðŸŒ¸'}
                    alt={p.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://placehold.co/40x40/fce7f3/f43f5e?text=Ch'
                    }}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  <span className="block max-w-20 truncate">{p.contenido || '-'}</span>
                </td>
                <td className="px-4 py-3 text-green-600 font-medium">${p.price}</td>
                <td className="px-4 py-3 text-gray-500">${p.cost}</td>
                <td className="px-4 py-3 text-blue-600">{p.profitMargin?.toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    p.stock > 1 ? 'bg-green-100 text-green-700'
                    : p.stock > 0 ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setReplenishing(p)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                      aria-label={`Reponer stock de ${p.name}`}>
                      <PackagePlus size={14} />
                    </button>
                    <button onClick={() => { setEditing(p); setShowForm(true) }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); toast.success('Producto guardado') }}
        />
      )}

      {replenishing && (
        <ReplenishStockForm
          product={replenishing}
          onClose={() => setReplenishing(null)}
          onSaved={() => {
            setReplenishing(null)
            load()
            toast.success('Stock actualizado')
          }}
        />
      )}
    </div>
  )
}
