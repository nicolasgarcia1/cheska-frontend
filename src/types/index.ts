export interface Product {
  id: number
  name: string
  description: string
  price: number
  cost?: number
  profitMargin?: number
  stock: number
  contenido?: string
  imageUrl: string
  isActive: boolean
  category: string
  createdAt: string
}

export interface SaleItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Sale {
  id: number
  saleDate: string
  customerName?: string
  notes?: string
  channel: string
  totalAmount: number
  totalProfit: number
  items: SaleItem[]
}

export interface MonthlySale {
  month: string
  revenue: number
  profit: number
  salesCount: number
}

export interface TopProduct {
  name: string
  quantitySold: number
  revenue: number
}

export interface LowStock {
  id: number
  name: string
  stock: number
}

export interface DashboardStats {
  totalRevenueThisMonth: number
  totalProfitThisMonth: number
  totalSalesThisMonth: number
  salesByMonth: MonthlySale[]
  topProducts: TopProduct[]
  lowStockAlerts: LowStock[]
}

export interface TokenResponse {
  token: string
  expiresAt: string
}
