import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as apiLogin, logout as apiLogout } from '../api/auth'
import { request } from '../api/index'

interface AuthUser {
  id: number
  name: string
  email: string
  role?: string
  permissions?: string[]
  phone?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<AuthUser | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const data = await apiLogin(email, password)
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  async function logout() {
    await apiLogout()
    token.value = null
    user.value = null
  }

  async function fetchUser() {
    const data = await request('/auth/user')
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  }

  return { token, user, isAuthenticated, login, logout, fetchUser }
})
