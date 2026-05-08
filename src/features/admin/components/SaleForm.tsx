import { useEffect, useState } from 'react'
import { productsApi } from '../../../api/productsApi'
import { salesApi } from '../../../api/salesApi'
import type { Product } from '../../../types'
import { X, Plus, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

const CHANNELS = ['WhatsApp', 'Instagram', 'Presencial']

interface SaleItemLocal {
  productId: number
  quantity: string
}

interface Props {
  onClose: () => void
  onSaved: () => void
}

export default function SaleForm({ onClose, onSaved }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<SaleItemLocal[]>([{ productId: 0, quantity: '1' }])
  const [customer, setCustomer] = useState('')
  const [channel, setChannel] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    productsApi
      .getAllAdmin()
      .then((data) => {
        setProducts(data.filter((product) => product.isActive))
        setError(false)
      })
      .catch(() => setError(true))
  }, [])

  const addItem = () => setItems((i) => [...i, { productId: 0, quantity: '1' }])
  const removeItem = (idx: number) => setItems((i) => i.filter((_, j) => j !== idx))
  const updateItem = (idx: number, key: keyof SaleItemLocal, val: number | string) =>
    setItems((i) =>
      i.map((item, j) => {
        if (j !== idx) return item

        if (key === 'productId') {
          return { ...item, productId: Number(val), quantity: '1' }
        }

        return { ...item, [key]: val }
      })
    )

  const total = items.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.productId)
    return sum + (p?.price ?? 0) * Number(item.quantity || 0)
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items
      .filter((item) => item.productId && Number(item.quantity) > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      }))

    if (validItems.length === 0) {
      toast.error('Seleccioná al menos un producto')
      return
    }

    const result = await Swal.fire({
      title: 'Registrar venta',
      text: 'Esta acción descuenta stock de los productos seleccionados. ¿Querés continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#BFA58A',
      cancelButtonColor: '#7A6F66',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    setLoading(true)
    try {
      await salesApi.create({ customerName: customer, channel, notes, items: validItems })
      onSaved()
    } catch {
      toast.error('No pudimos registrar la venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Registrar Venta</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded-xl border border-[#f1d4b6] bg-[#FAF4F0] px-4 py-3 text-sm text-cheska-text">
              No pudimos cargar los productos.
            </div>
          )}
          <input placeholder="Nombre del cliente" value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary" />
          <select value={channel} onChange={(e) => setChannel(+e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary">
            {CHANNELS.map((c, i) => <option key={c} value={i}>{c}</option>)}
          </select>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                {(() => {
                  const selectedProduct = products.find((p) => p.id === item.productId)
                  const availableStock = selectedProduct?.stock ?? 0

                  return (
                    <>
                <select value={item.productId}
                  onChange={(e) => updateItem(idx, 'productId', +e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary">
                  <option value={0}>Seleccionar producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name} - ${p.price}{p.stock === 0 ? ' - Sin stock' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                  disabled={!selectedProduct || availableStock === 0}
                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-center disabled:bg-gray-50 disabled:text-gray-400"
                >
                  {!selectedProduct ? (
                    <option value="1">-</option>
                  ) : (
                    Array.from({ length: availableStock }, (_, i) => i + 1).map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))
                  )}
                </select>
                    </>
                  )
                })()}
                <button type="button" onClick={() => removeItem(idx)}
                  className="text-cheska-accent">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem}
              className="flex items-center gap-1 text-xs text-cheska-accent">
              <Plus size={12} /> Agregar producto
            </button>
          </div>
          <textarea placeholder="Notas (opcional)" value={notes}
            onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cheska-secondary resize-none" />
          <div className="bg-[#FAF4F0] rounded-xl px-4 py-3">
            <p className="font-bold text-cheska-accent text-lg">Total: ${total.toFixed(2)}</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 bg-cheska-accent text-white rounded-xl text-sm hover:bg-cheska-soft disabled:opacity-60">
              {loading ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
