import { request } from './index'

export interface FinancialReportParams {
	date_from: string
	date_to: string
}

export const getProfitReport = (params: FinancialReportParams) => {
	const query = new URLSearchParams(params as any).toString()
	return request(`/reports/financial/profit?${query}`)
}

export const getExpensesReport = (params: FinancialReportParams) => {
	const query = new URLSearchParams(params as any).toString()
	return request(`/reports/financial/expenses?${query}`)
}

export const getSalesReport = (params: FinancialReportParams) => {
	const query = new URLSearchParams(params as any).toString()
	return request(`/reports/financial/sales?${query}`)
}
