import { useEffect, useState } from 'react'
import { productsApi } from '../../../api/productsApi'
import type { Product } from '../../../types'
import ProductForm from '../components/ProductForm'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const load = () => productsApi.getAllAdmin().then(setProducts)
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Â¿Eliminar producto?')) return
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
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 text-sm"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Imagen', 'Nombre', 'Precio', 'Costo', 'Margen', 'Stock', 'Estado', ''].map((h) => (
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
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-green-600 font-medium">${p.price}</td>
                <td className="px-4 py-3 text-gray-500">${p.cost}</td>
                <td className="px-4 py-3 text-blue-600">{p.profitMargin?.toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    p.stock > 5 ? 'bg-green-100 text-green-700'
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
    </div>
  )
}
