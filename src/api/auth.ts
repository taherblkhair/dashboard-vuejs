const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

interface LoginPayload {
	email: string
	password: string
}

export async function login(email: string, password: string) {
	const payload: LoginPayload = { email, password }
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})

	if (!res.ok) {
		const err = await res.json().catch(() => ({}))
		throw new Error(err.message || 'فشل تسجيل الدخول')
	}

	const data = await res.json()
	// Assumes API returns { token: '...', user: { ... } } or similar
	return data
}

export async function logout(token?: string) {
	// best-effort logout call; ignore network errors
	try {
		await fetch(`${API_BASE}/auth/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {})
			}
		})
	} catch (e) {
		// ignore
	}
}

export default { login, logout }
