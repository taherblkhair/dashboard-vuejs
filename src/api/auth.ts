const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
// production: 'https://karamstore.ly/api'

// دالة مساعدة لجلب الهيدرز مع التوكن من الـ LocalStorage تلقائياً
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

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
    
    // هام جداً: حفظ التوكن عند نجاح الدخول لكي تستخدمه الدوال الأخرى
    if (data.token) {
        localStorage.setItem('token', data.token)
    }
    
    return data
}

// أضف هذه الدالة هنا (أو ابحث عنها في ملف index.ts وقم بتعديلها)
// هي الدالة التي تظهر في السطر 27 وتسبب الخطأ 401
export async function getDashboardData() {
    const res = await fetch(`${API_BASE}/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders() // هنا يتم إرسال التوكن المحفوظ
    })

    if (res.status === 401) {
        // إذا كان التوكن غير صالح، امسحه ووجه المستخدم لتسجيل الدخول
        localStorage.removeItem('token')
        window.location.href = '/pos/login'
        throw new Error('Unauthorized')
    }

    return await res.json()
}

export async function logout() {
    const token = localStorage.getItem('token')
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders()
        })
    } catch (e) {
        // ignore
    } finally {
        // مسح البيانات من الجهاز في كل الأحوال
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

// تصدير كل الدوال لاستخدامها في المكونات (Components)
export default { login, logout, getDashboardData }