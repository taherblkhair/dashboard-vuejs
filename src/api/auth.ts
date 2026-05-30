import { request } from './index'

interface LoginPayload {
    email: string
    password: string
}

export async function login(email: string, password: string) {
    const payload: LoginPayload = { email, password }
    const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    })

    if (data.token) {
        localStorage.setItem('token', data.token)
    }

    return data
}

export async function getDashboardData() {
    try {
        return await request('/dashboard')
    } catch (e: any) {
        if (e?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/pos/login'
        }
        throw e
    }
}

export async function logout() {
    try {
        await request('/auth/logout', { method: 'POST' })
    } catch {
        // ignore
    } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

export default { login, logout, getDashboardData }
