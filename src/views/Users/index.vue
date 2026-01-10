<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة المستخدمين</h1>
          <p class="text-slate-500 font-medium">عرض وإدارة جميع المستخدمين والصلاحيات في النظام</p>
        </div>

        <div class="flex items-center gap-4">
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-200"
            @click="openCreateModal"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </template>
            إضافة مستخدم جديد
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MStatsCard
          label="إجمالي المستخدمين"
          :value="totalUsers"
          variant="indigo"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="مستخدمون نشطون"
          :value="activeUsers"
          variant="emerald"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </template>
        </MStatsCard>

        <MStatsCard
          label="مسؤول النظام"
          :value="adminUsers"
          variant="amber"
        >
          <template #icon>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 2.04M12 21.75c-2.676 0-5.216-.584-7.499-1.632A11.97 11.97 0 013 12c0-5.392 3.515-9.963 8.413-11.532a11.959 11.959 0 017.174 0C20.485 2.037 24 6.608 24 12c0 3.328-1.353 6.34-3.501 8.368A11.97 11.97 0 0112 21.75z"/>
            </svg>
          </template>
        </MStatsCard>
      </div>

      <!-- Filters & Table Section -->
      <MCard class="!p-0 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <!-- Filters Area -->
        <div class="p-8 border-b border-slate-50 bg-slate-50/30">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex-1 min-w-[300px]">
              <MInput
                v-model="searchQuery"
                placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
                class="!rounded-2xl"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </template>
              </MInput>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div class="relative min-h-[400px]">
          <div v-if="loading && users.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري التحميل...</p>
          </div>
          
          <MTable v-else-if="users.length > 0">
            <template #header>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">بيانات الاتصال</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الدور</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الإنشاء</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
            </template>
            
            <tr v-for="user in users" :key="user.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm border border-white shrink-0">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="space-y-0.5">
                    <p class="font-bold text-slate-900">{{ user.name }}</p>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-slate-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm font-medium">{{ user.email }}</span>
                  </div>
                  <div v-if="user.phone" class="flex items-center gap-2 text-slate-400">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="text-xs font-bold">{{ user.phone }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <MBadge variant="info" class="!px-4 !py-1.5 !rounded-xl">
                  {{ user.role?.name || 'مستخدم' }}
                </MBadge>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <button 
                    @click="handleToggleStatus(user)"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    :class="user.is_active ? 'bg-indigo-600' : 'bg-slate-200'"
                  >
                    <span 
                      aria-hidden="true" 
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="user.is_active ? '-translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                  <span class="text-xs font-bold" :class="user.is_active ? 'text-emerald-600' : 'text-slate-400'">
                    {{ user.is_active ? 'نشط' : 'معطل' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="space-y-0.5">
                  <p class="text-sm font-bold text-slate-700">{{ new Date(user.created_at).toLocaleDateString('ar-LY') }}</p>
                  <p class="text-[10px] font-black text-slate-400 uppercase">{{ new Date(user.created_at).toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
              </td>
              <td class="px-8 py-5">
                <ActionMenu :items="[
                  { label: 'تعديل', action: () => openEditModal(user) },
                  { label: 'حذف', action: () => handleDeleteUser(user), icon: IconTrash, variant: 'danger' }
                ]" />
              </td>
            </tr>
          </MTable>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
            <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-2">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-black text-slate-900">لا يوجد مستخدمون</h3>
              <p class="text-slate-500">جرب تغيير شروط البحث أو إضافة مستخدم جديد</p>
            </div>
            <MButton variant="primary" size="lg" @click="openCreateModal" class="!rounded-2xl">
              إضافة مستخدم جديد
            </MButton>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div class="text-sm font-bold text-slate-500">
            الصفحة <span class="text-indigo-600">{{ currentPage }}</span> من <span class="text-slate-900">{{ totalPages }}</span>
          </div>
          <div class="flex items-center gap-2">
            <MButton
              variant="secondary"
              size="sm"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="!rounded-xl group"
            >
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </template>
              السابق
            </MButton>
            <MButton
              variant="secondary"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
              class="!rounded-xl group flex-row-reverse"
            >
              <template #icon>
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </template>
              التالي
            </MButton>
          </div>
        </div>
      </MCard>
    </div>

    <!-- Add User Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <MCard class="relative w-full max-w-lg !p-0 !rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in duration-300">
        <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ form.id ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد' }}</h3>
            <p class="text-slate-400 text-xs font-medium">{{ form.id ? 'قم بتعديل بيانات المستخدم وحفظ التغييرات' : 'أدخل بيانات المستخدم الجديد للبدء' }}</p>
          </div>
          <button @click="closeModal" class="p-2 text-slate-400 hover:bg-white rounded-xl transition-all shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitUser" class="p-8 space-y-6">
          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">الاسم الكامل <span class="text-rose-500">*</span></label>
            <MInput v-model="form.name" placeholder="مثلاً: علي محمد" class="!rounded-2xl" required />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">البريد الإلكتروني <span class="text-rose-500">*</span></label>
            <MInput v-model="form.email" type="email" placeholder="ali@example.com" class="!rounded-2xl" required />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">كلمة المرور <span v-if="!form.id" class="text-rose-500">*</span></label>
            <MInput v-model="form.password" type="password" placeholder="••••••••" class="!rounded-2xl" :required="!form.id" />
            <p v-if="form.id" class="text-[10px] text-slate-400 px-1 mt-1">اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور</p>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">الدور <span class="text-rose-500">*</span></label>
            <select 
              v-model="form.role_id" 
              class="w-full h-14 px-4 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700"
              required
            >
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
          </div>

          <div class="pt-6 flex gap-3">
             <MButton variant="secondary" size="lg" type="button" @click="closeModal" class="flex-1 !rounded-2xl">إلغاء</MButton>
             <MButton variant="primary" size="lg" type="submit" class="flex-[2] !rounded-2xl shadow-lg shadow-indigo-100" :loading="submitting">
                {{ form.id ? 'حفظ التعديلات' : 'إضافة المستخدم' }}
             </MButton>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h, watch } from 'vue'
import { fetchUsers as apiFetchUsers, toggleUserStatus, deleteUser, createUser, updateUser, fetchRoles } from '../../api/users'
import { useConfirm } from '../../composables/useConfirm'
import ActionMenu from '../../components/ui/ActionMenu.vue'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MTable from '../../components/ui/MTable.vue'
import MStatsCard from '../../components/ui/MStatsCard.vue'

// Icons
const IconTrash = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-4 h-4' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })]) })

const { confirm } = useConfirm()

// Data State
const users = ref<any[]>([])
const roles = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)

const form = ref<any>({
  id: null,
  name: '',
  email: '',
  password: '',
  role_id: 1
})

// Stats
const totalUsers = computed(() => totalCount.value)
const activeUsers = computed(() => users.value.filter(u => u.is_active).length)
const adminUsers = computed(() => users.value.filter(u => u.role?.name === 'admin').length)

// Fetch Data
const fetchUsers = async (page: number = 1) => {
  loading.value = true
  try {
    const data = await apiFetchUsers(page, searchQuery.value)
    users.value = data.data || []
    currentPage.value = data.current_page || 1
    totalPages.value = data.last_page || 1
    totalCount.value = data.total || 0
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const data = await fetchRoles()
    roles.value = data || []
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

// Watchers
let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers(1)
  }, 500)
})

// Actions
const handleToggleStatus = async (user: any) => {
  const confirmed = await confirm({
    title: 'تغيير حالة المستخدم',
    message: `هل أنت متأكد من ${user.is_active ? 'تعطيل' : 'تنشيط'} المستخدم "${user.name}"؟`,
    type: 'warning'
  })
  if (!confirmed) return

  try {
    await toggleUserStatus(user.id)
    user.is_active = !user.is_active
  } catch (e) {
    console.error('Error toggling status:', e)
  }
}

const handleDeleteUser = async (user: any) => {
  const confirmed = await confirm({
    title: 'حذف مستخدم',
    message: `هل أنت متأكد من حذف المستخدم "${user.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    type: 'danger',
    confirmText: 'حذف'
  })
  if (!confirmed) return

  try {
    await deleteUser(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
    totalCount.value--
  } catch (e) {
    console.error('Error deleting user:', e)
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchUsers(page)
  }
}

const openCreateModal = () => {
  form.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role_id: roles.value[0]?.id || 1
  }
  showModal.value = true
}

const openEditModal = (user: any) => {
  form.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role_id: user.role_id
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitUser = async () => {
  const confirmed = await confirm({
    title: form.value.id ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد',
    message: form.value.id ? 'هل أنت متأكد من حفظ التعديلات على بيانات هذا المستخدم؟' : 'هل أنت متأكد من إضافة هذا المستخدم الجديد؟',
    type: 'info'
  })
  if (!confirmed) return

  submitting.value = true
  try {
    if (form.value.id) {
      // Update logic
      const updateData = { ...form.value }
      if (!updateData.password) delete updateData.password
      await updateUser(form.value.id, updateData)
    } else {
      // Create logic
      await createUser(form.value)
    }
    closeModal()
    fetchUsers(form.value.id ? currentPage.value : 1)
  } catch (e: any) {
    console.error('Error saving user:', e)
    alert(form.value.id ? 'فشل في تحديث بيانات المستخدم' : 'فشل في إضافة المستخدم')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
  loadRoles()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
