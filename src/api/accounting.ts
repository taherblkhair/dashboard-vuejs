import { request } from './index'
import type { PaginationMeta } from './index'

export interface Vault {
  id: number
  name: string
  type: 'cash' | 'bank'
  balance: number
  is_active: boolean
}

export interface VaultTransaction {
  id: number
  type: 'income' | 'expense' | 'transfer'
  amount: number
  vault_id: number
  target_vault_id?: number | null
  reference_type?: string | null
  reference_id?: number | null
  description?: string | null
  vault?: Vault
  target_vault?: Vault
  created_by?: { id: number; name: string }
  created_at: string
}

export interface VaultsResponse {
  data: {
    vaults: Vault[]
    total_balance: number
  }
}

export interface TransactionsResponse {
  data: VaultTransaction[]
  meta: PaginationMeta
}

export interface DailyReportVaultRow {
  vault: Vault
  income: number
  expense: number
  transfer_in: number
  transfer_out: number
  net_movement: number
  closing_balance: number
}

export interface DailyReport {
  date: string
  total_income: number
  total_expense: number
  transfer_volume: number
  net: number
  total_balance: number
  vaults: DailyReportVaultRow[]
  transactions: VaultTransaction[]
}

export async function fetchVaults(): Promise<VaultsResponse['data']> {
  const res = await request('/financial/vaults') as VaultsResponse
  return res.data
}

export async function fetchTransactions(params: {
  page?: number
  type?: string
  vault_id?: number
  date_from?: string
  date_to?: string
} = {}): Promise<TransactionsResponse> {
  const qs = new URLSearchParams()
  if (params.page) qs.append('page', String(params.page))
  if (params.type) qs.append('type', params.type)
  if (params.vault_id) qs.append('vault_id', String(params.vault_id))
  if (params.date_from) qs.append('date_from', params.date_from)
  if (params.date_to) qs.append('date_to', params.date_to)

  return request(`/financial/transactions?${qs.toString()}`)
}

export async function createTransaction(payload: {
  type: 'income' | 'expense' | 'transfer'
  amount: number
  vault_id: number
  target_vault_id?: number
  description?: string
}): Promise<{ data: VaultTransaction; message: string }> {
  return request('/financial/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchDailyReport(date?: string): Promise<DailyReport> {
  const qs = date ? `?date=${date}` : ''
  const res = await request(`/financial/reports/daily${qs}`) as { data: DailyReport }
  return res.data
}

export interface CustomerDebt {
  id: number
  customer_id: number
  order_id: number
  original_amount: number
  remaining_amount: number
  status: 'open' | 'partial' | 'paid'
  customer?: { id: number; name: string; phone?: string }
  order?: { id: number; code: string; total: number; payment_terms: string }
}

export async function fetchCustomerDebts(params: { open_only?: boolean; page?: number } = {}): Promise<{ data: CustomerDebt[]; summary: { total_outstanding: number } }> {
  const qs = new URLSearchParams()
  if (params.open_only) qs.append('open_only', '1')
  if (params.page) qs.append('page', String(params.page))
  return request(`/financial/customer-debts?${qs.toString()}`)
}

export async function collectCustomerDebt(debtId: number, payload: { amount: number; payment_method: string }): Promise<any> {
  return request(`/financial/customer-debts/${debtId}/collect`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface CustomerAccountSummary {
  customer_id: number
  total_owed: number
  credit_balance: number
  net_balance: number
  balance_type: 'debit' | 'credit' | 'settled'
  balance_label: string
  open_debts_count: number
  total_receipts: number
  total_payments: number
}

export interface CustomerStatementEntry {
  date: string
  type: string
  type_label: string
  reference_code?: string
  description: string
  debit: number
  credit: number
  balance: number
}

export interface FinancialReceipt {
  id: number
  code: string
  type: 'receipt' | 'payment'
  type_label: string
  customer_id: number
  order_id?: number | null
  payment_method: string
  amount: number
  notes?: string | null
  receipt_date: string
  customer?: { id: number; name: string; phone?: string }
  order?: { id: number; code: string; total: number }
  vault?: { id: number; name: string; type: string }
}

export async function fetchCustomerAccountSummary(customerId: number): Promise<CustomerAccountSummary> {
  const res = await request(`/customers/${customerId}/account/summary`) as { data: CustomerAccountSummary }
  return res.data
}

export async function fetchCustomerStatement(customerId: number, params: { date_from?: string; date_to?: string } = {}) {
  const qs = new URLSearchParams()
  if (params.date_from) qs.append('date_from', params.date_from)
  if (params.date_to) qs.append('date_to', params.date_to)
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return request(`/customers/${customerId}/account/statement${query}`)
}

export async function fetchCustomerOpenDebts(customerId: number) {
  const res = await request(`/customers/${customerId}/account/debts`) as { data: any[] }
  return res.data
}

export async function issueCustomerReceipt(customerId: number, payload: Record<string, unknown>) {
  return request(`/customers/${customerId}/account/receipts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function issueCustomerPayment(customerId: number, payload: Record<string, unknown>) {
  return request(`/customers/${customerId}/account/payments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchFinancialReceipts(params: {
  page?: number
  type?: string
  customer_id?: number
  search?: string
  date_from?: string
  date_to?: string
} = {}): Promise<{ data: FinancialReceipt[]; meta: PaginationMeta }> {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v))
  })
  return request(`/financial/receipts?${qs.toString()}`)
}

export async function fetchFinancialReceipt(id: number): Promise<FinancialReceipt> {
  const res = await request(`/financial/receipts/${id}`) as { data: FinancialReceipt }
  return res.data
}

export function getReceiptPrintUrl(id: number): string {
  const route = `/accounting/receipts/${id}/print`
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}${route}`
}

export function getOrderPrintUrl(orderId: number, mode: 'invoice' | 'receipt' | 'combined' = 'invoice', receiptId?: number): string {
  const params = new URLSearchParams({ mode })
  if (receiptId) params.set('receipt_id', String(receiptId))
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/orders/${orderId}/print?${params.toString()}`
}
