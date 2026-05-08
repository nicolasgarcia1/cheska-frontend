import { useState } from 'react'
import { X } from 'lucide-react'
import type { Product } from '../../../types'
import { productsApi } from '../../../api/productsApi'

interface Props {
  product: Product
  onClose: () => void
  onSaved: () => void
}

export default function ReplenishStockForm({ product, onClose, onSaved }: Props) {
  const [quantity, setQuantity] = useState('1')
  const [cost, setCost] = useState(String(product.cost ?? 0))
  const [price, setPrice] = useState(String(product.price))
  const [loading, setLoading] = useState(false)

  const quantityNumber = Number(quantity || 0)
  const nextStock = product.stock + quantityNumber

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      await productsApi.replenishStock(product.id, {
        quantity: quantityNumber,
        cost: Number(cost || 0),
        price: Number(price || 0),
      })
      onSaved()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">Reponer stock</h2>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cantidad a sumar
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Nuevo costo de compra
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Precio de venta actual
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary"
            />
          </div>

          <div className="rounded-xl bg-[#FAF4F0] px-4 py-3 text-sm text-cheska-accent">
            Stock actual: <strong>{product.stock}</strong>. Stock despues de reponer:{' '}
            <strong>{Number.isFinite(nextStock) ? nextStock : product.stock}</strong>.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-cheska-accent px-4 py-2 text-sm text-white hover:bg-cheska-soft disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Reponer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
