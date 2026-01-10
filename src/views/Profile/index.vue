<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1200px] mx-auto space-y-8">
      <!-- Header Section -->
      <div v-if="user" class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <MCard class="relative !p-10 !rounded-[3rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
          <div class="flex flex-col md:flex-row items-center gap-10">
            <!-- Avatar -->
            <div class="relative shrink-0">
               <div class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 p-1 shadow-2xl shadow-indigo-200">
                 <div class="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center text-4xl font-black text-indigo-600 border-4 border-white/20">
                    {{ user.name.charAt(0) }}
                 </div>
               </div>
               <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
            </div>

            <!-- User Brief -->
            <div class="text-center md:text-right space-y-4 flex-1">
              <div class="space-y-1">
                <MBadge variant="info" class="!px-4 !py-1 !rounded-xl !text-[10px] !font-black !uppercase tracking-widest">
                  {{ user.role?.name || 'مستخدم' }}
                </MBadge>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight">{{ user.name }}</h1>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-bold">{{ user.email }}</span>
                </div>
                <div v-if="user.phone" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-bold">{{ user.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </MCard>
      </div>

      <!-- Content Grid -->
      <div v-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Permissions -->
          <MCard class="!p-8 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
            <div class="flex items-center justify-between mb-8">
              <div class="space-y-1">
                <h3 class="text-xl font-black text-slate-900 tracking-tight">صلاحيات النظام</h3>
                <p class="text-slate-400 text-xs font-medium">قائمة بجميع العمليات المصرح لك بالقيام بها</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 2.04M12 21.75c-2.676 0-5.216-.584-7.499-1.632A11.97 11.97 0 013 12c0-5.392 3.515-9.963 8.413-11.532a11.959 11.959 0 017.174 0C20.485 2.037 24 6.608 24 12c0 3.328-1.353 6.34-3.501 8.368A11.97 11.97 0 0112 21.75z"/>
                </svg>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="perm in user.role?.permissions" 
                :key="perm"
                class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:scale-[1.02] group"
              >
                <div class="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm transition-all group-hover:bg-emerald-500 group-hover:text-white">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm font-bold text-slate-700 capitalize">{{ perm.replace('.', ' ') }}</span>
              </div>
            </div>
          </MCard>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-8">
           <MCard class="!p-8 !rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
            <h3 class="text-lg font-black text-slate-900 mb-6 tracking-tight">معلومات الحساب</h3>
            
            <div class="space-y-6">
              <div class="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الإنشاء</p>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-700">{{ formatDate(user.created_at) }}</p>
                </div>
              </div>

              <div class="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">حالة الحساب</p>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center" :class="user.is_active ? 'text-emerald-500' : 'text-slate-400'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold" :class="user.is_active ? 'text-emerald-600' : 'text-slate-500'">
                    {{ user.is_active ? 'نشط بالكامل' : 'معطل مؤقتاً' }}
                  </p>
                </div>
              </div>
            </div>
          </MCard>

       <MCard class="!p-8 !rounded-[2.5rem] border-none shadow-2xl shadow-indigo-200/50 overflow-hidden relative group bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700">
  <!-- تأثيرات الخلفية -->
  <div class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-30 transition-all duration-1000 group-hover:opacity-40 group-hover:scale-125"></div>
  <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 transition-all duration-1000 group-hover:opacity-30 group-hover:scale-110"></div>
  
  <!-- العناصر الزخرفية -->


  <div class="relative space-y-6">
    <!-- العنوان والوصف -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-black text-white tracking-tight">دعم النظام الفني</h3>
      </div>
      
      <p class="text-white/90 text-sm font-medium leading-relaxed pr-2">
        نحن هنا لمساعدتك! إذا كنت تواجه أي تحديات في استخدام النظام أو بحاجة إلى تعديل صلاحيات الوصول، فريق الدعم الفني جاهز للإجابة على استفساراتك.
      </p>
    </div>

  

  </div>
</MCard>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-40 gap-6">
        <div class="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري تحميل بياناتك...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchUserProfile } from '../../api/users'
import MCard from '../../components/ui/MCard.vue'
import MBadge from '../../components/ui/MBadge.vue'
import MButton from '../../components/ui/MButton.vue'

const user = ref<any>(null)
const loading = ref(true)

const loadProfile = async () => {
  try {
    const res = await fetchUserProfile()
    user.value = res || null
  } catch (e) {
    console.error('Error fetching profile:', e)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ar-LY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.group:hover .blur {
  opacity: 0.3;
}
</style>
