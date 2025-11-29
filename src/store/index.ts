import { reactive } from 'vue'
import * as authApi from '../api/auth'

type User = Record<string, any> | null

const state = reactive({
	token: (localStorage.getItem('token') as string | null),
	user: (JSON.parse(localStorage.getItem('user') || 'null') as User),
	loading: false as boolean,
	error: null as string | null
})

async function login(email: string, password: string) {
	state.loading = true
	state.error = null
	try {
		const data = await authApi.login(email, password)
		// adapt to common shapes: { token, user } or { access_token, user }
		const token = data.token || data.access_token || data.data?.token
		const user = data.user || data.data?.user || data.data?.user || null

		if (!token) throw new Error('لم يتم استلام توكن من الخادم')

		state.token = token
		state.user = user
		localStorage.setItem('token', token)
		localStorage.setItem('user', JSON.stringify(user))
		return data
	} catch (e: any) {
		state.error = e?.message || 'خطأ أثناء تسجيل الدخول'
		throw e
	} finally {
		state.loading = false
	}
}

async function logout() {
	const token = state.token
	// call API but don't fail if network error
	try {
		await authApi.logout(token || undefined)
	} catch (e) {
		// ignore
	}

	state.token = null
	state.user = null
	localStorage.removeItem('token')
	localStorage.removeItem('user')
}

export function useAuth() {
	return {
		state,
		login,
		logout
	}
}

export default { useAuth }
