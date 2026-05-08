import { useState } from 'react'
import type { Product } from '../../../types'
import { productsApi } from '../../../api/productsApi'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['BodySplash', 'Crema', 'Kit', 'Otro']
const NUMERIC_FIELDS = ['price', 'cost', 'stock']

interface Props {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

export default function ProductForm({ product, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    cost: product ? String(product.cost ?? 0) : '',
    stock: product ? String(product.stock) : '',
    contenido: product?.contenido ?? '',
    category: product?.category ? CATEGORIES.indexOf(product.category) : 0,
    isActive: product?.isActive ?? true,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        const value = NUMERIC_FIELDS.includes(k) && v === '' ? '0' : String(v)
        fd.append(k, value)
      })
      if (image) fd.append('image', image)
      if (product) await productsApi.update(product.id, fd)
      else await productsApi.create(fd)
      onSaved()
    } catch {
      toast.error('No pudimos guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">{product ? 'Editar' : 'Nuevo'} Producto</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {([
            { label: 'Nombre', key: 'name', type: 'text' },
            { label: 'Descripción', key: 'description', type: 'text' },
            { label: 'Precio', key: 'price', type: 'number' },
            { label: 'Costo', key: 'cost', type: 'number' },
            { label: 'Stock', key: 'stock', type: 'number' },
            { label: 'Contenido', key: 'contenido', type: 'text' },
          ] as const).map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Categorí­a</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: +e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary"
            >
              {CATEGORIES.map((c, i) => <option key={c} value={i}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#FAF4F0] file:text-cheska-text"
            />
          </div>
          {product && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Activo
            </label>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 bg-cheska-accent text-white rounded-xl text-sm hover:bg-cheska-soft disabled:opacity-60">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
