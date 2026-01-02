<template>
  <div class="min-h-screen bg-gray-50/50 pb-12" dir="rtl">
    <!-- Header Area -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          <!-- Title & Breadcrumb -->
          <div class="flex items-center gap-4">
            <button @click="router.back()" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" class="transform rotate-180" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">تفاصيل التوصيل <span class="text-gray-400 text-lg font-medium">#{{ delivery?.tracking_number }}</span></h1>
              <div class="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span>{{ formatDate(delivery?.created_at) }}</span>
                <span>•</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(delivery?.status)]">
                  {{ statusLabels[delivery?.status] || delivery?.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div>
             <router-link to="/deliveries" class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
               العودة للقائمة
             </router-link>
          </div>
        </div>
      </div>
    </header>

    <main v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
       <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        جارٍ تحميل البيانات...
    </main>
    
    <main v-else-if="!delivery" class="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
      لم يتم العثور على التوصيل المطلوب.
    </main>

    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Visual Timeline -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 overflow-x-auto">
        <div class="min-w-[700px]">
           <div class="relative flex items-center justify-between">
             <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full"></div>
             <div class="absolute top-1/2 left-0 h-1 bg-blue-500 -z-0 rounded-full transition-all duration-1000" :style="{ width: progressPercentage + '%' }"></div>
             
             <div v-for="(step, idx) in timelineSteps" :key="step.key" class="relative z-10 flex flex-col items-center group cursor-default">
               <div :class="[
                 'w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                 isStepConfigured(idx) ? 'bg-blue-600 border-blue-100 text-white shadow-md scale-110' : 
                 (idx === currentStepIndex ? 'bg-white border-blue-500 text-blue-600 shadow-sm scale-110' : 'bg-white border-gray-200 text-gray-300')
               ]">
                 <component :is="step.icon" class="w-5 h-5" />
               </div>
               <span :class="[
                 'mt-3 text-sm font-medium transition-colors duration-300',
                 isStepConfigured(idx) || idx === currentStepIndex ? 'text-gray-900' : 'text-gray-400'
               ]">{{ step.label }}</span>
             </div>
           </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          
           <!-- Tracking Timeline (History) -->
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                <h3 class="text-base font-semibold text-gray-900">سجل التتبع</h3>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{{ (delivery.tracking_updates || []).length }} تحديثات</span>
              </div>
              
              <div class="p-6">
                 <div v-if="!(delivery.tracking_updates || []).length" class="text-center py-6 text-gray-400 text-sm">
                    لا توجد تحديثات متاحة بعد
                 </div>

                 <div v-else class="space-y-8 relative pl-4 pr-2">
                    <div class="absolute top-2 bottom-2 right-[15px] w-0.5 bg-gray-100"></div>

                    <div v-for="(u, idx) in delivery.tracking_updates" :key="u.id" class="relative flex items-start gap-4">
                       <div :class="['relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 bg-white shrink-0', idx === 0 ? 'border-blue-100 text-blue-600' : 'border-gray-100 text-gray-400']">
                          <div :class="['w-2.5 h-2.5 rounded-full', idx === 0 ? 'bg-blue-600' : 'bg-gray-300']"></div>
                       </div>
                       <div class="bg-gray-50 rounded-lg p-4 flex-1 border border-gray-100">
                          <div class="flex flex-col sm:flex-row justify-between items-start gap-2">
                             <div>
                                <h4 class="font-bold text-gray-900 text-sm">{{ u.status }}</h4>
                                <p class="text-sm text-gray-600 mt-1">{{ u.notes || '—' }}</p>
                             </div>
                             <span class="text-xs text-gray-400 font-mono whitespace-nowrap">{{ formatDate(u.created_at) }}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Provider Detail Card -->
           <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                 <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">تفاصيل المزود والمندوب</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">مزود الخدمة</label>
                    <div class="flex items-center gap-3">
                       <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                       </div>
                       <div>
                          <p class="font-medium text-gray-900">{{ delivery.provider?.name ?? '-' }}</p>
                          <p class="text-xs text-gray-500 font-mono">{{ delivery.provider?.phone ?? '' }}</p>
                       </div>
                    </div>
                 </div>
                 
                 <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <label class="block text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">المندوب المُعين</label>
                    <div v-if="delivery.rider" class="flex items-center gap-3">
                       <div class="h-10 w-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                          {{ delivery.rider.name?.charAt(0) || 'R' }}
                       </div>
                       <div>
                          <p class="font-bold text-blue-900 text-sm">{{ delivery.rider.name }}</p>
                          <p class="text-xs text-blue-700 font-mono">{{ delivery.rider.phone }}</p>
                       </div>
                    </div>
                    <div v-else class="flex items-center gap-2 text-gray-500 text-sm italic">
                       <span>لم يتم تعيين مندوب بعد</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
           
           <!-- Status Update Card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">تحديث الحالة</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">الحالة التالية المتاحة</label>
                <div class="relative">
                   <select v-model="newStatus" :disabled="allowedStatusOptions.length === 0" class="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 appearance-none transition-shadow">
                    <option value="" disabled>{{ allowedStatusOptions.length ? 'اختر الحالة...' : 'لا توجد حالات متاحة' }}</option>
                    <option v-for="opt in allowedStatusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <button @click="changeStatus" 
                   :disabled="saving || isStatusInvalid"
                   class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                تحديث الحالة
              </button>
              
               <p v-if="allowedStatusOptions.length" class="text-xs text-center text-gray-400 pt-1">المسار: <span class="font-medium text-gray-600">{{ allowedStatusText }}</span></p>
            </div>
          </div>

          <!-- Rider Assignment Card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">إدارة المندوب</h3>
             <div v-if="ridersForProvider.length" class="space-y-3">
                 <select v-model.number="selectedRider" :disabled="!canAssign && !canReassign" class="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>{{ canAssign ? 'اختر مندوب للتعيين' : (canReassign ? 'اختر مندوب جديد' : 'غير متاح للتعديل') }}</option>
                    <option v-for="r in ridersForProvider" :key="r.id" :value="r.id">{{ r.name }}</option>
                 </select>
                 <button @click="reassign" :disabled="saving || !selectedRider || (!canAssign && !canReassign)" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none disabled:opacity-50">
                    {{ canAssign ? 'تأكيد التعيين' : 'إعادة التعيين' }}
                 </button>
                 <p v-if="!canAssign && !canReassign" class="text-xs text-gray-400 text-center">الإجراء غير متاح حالياً.</p>
             </div>
             <div v-else class="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">لا يوجد مناديب متاحين</div>
          </div>

          <!-- Summary/Stats Card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
             <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">ملخص التوصيل</h3>
             
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">رسوم التوصيل</span>
                <span class="font-bold text-gray-900 font-mono">{{ formatCurrency(delivery.delivery_fee) }}</span>
             </div>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">المسافة</span>
                <span class="font-medium text-gray-900 font-mono">{{ delivery.distance_km || 0 }} كم</span>
             </div>
             <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">الوزن</span>
                <span class="font-medium text-gray-900 font-mono">{{ delivery.weight_kg || 0 }} كجم</span>
             </div>
             
             <div class="pt-2">
                <div v-if="delivery.order_id" @click="router.push(`/orders/${delivery.order_id}`)" class="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors group">
                   <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      <span class="text-sm font-medium text-blue-900">الطلب المرتبط</span>
                   </div>
                   <span class="text-sm font-bold text-blue-700 font-mono group-hover:underline">#{{ delivery.order?.code ?? delivery.order_id }}</span>
                </div>
             </div>
          </div>

          <!-- Proof Upload Card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">إثبات التسليم</h3>
             <div class="space-y-3">
                 <label class="block w-full cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg p-6 text-center hover:bg-gray-100 transition-colors group">
                    <svg class="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span class="mt-2 block text-xs text-gray-500">{{ selectedFile ? selectedFile.name : 'اضغط لرفع ملف الإثبات' }}</span>
                    <input ref="fileInput" type="file" @change="onFileChange" class="hidden" />
                 </label>
                 <button @click="upload" :disabled="saving || !selectedFile" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-colors">
                   رفع الملف
                 </button>
             </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDelivery, uploadProof, assignRiderToDelivery, updateDeliveryStatus } from '../../api/deliveries'
import { fetchRiders } from '../../api/riders'
import { useToast } from '../../composables/useToast'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { 
  DELIVERY_VALID_TRANSITIONS, 
  DELIVERY_STATUS_LABELS, 
  getDeliveryStatusColor 
} from '../../constants'

// Icons
const IconClock = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) })
const IconUser = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })]) })
const IconBox = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })]) })
const IconTruck = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })]) })
const IconCheck = defineComponent({ render: () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const delivery = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const ridersForProvider = ref<any[]>([])
const selectedRider = ref<number | null>(null)

// constants
const allowedTransitions: any = DELIVERY_VALID_TRANSITIONS
const statusLabels: any = DELIVERY_STATUS_LABELS

// Timeline Steps
const timelineSteps = [
  { key: 'pending', label: 'قيد الانتظار', icon: IconClock },
  { key: 'assigned', label: 'تم التعيين', icon: IconUser },
  { key: 'picked_up', label: 'عند المندوب', icon: IconBox },
  { key: 'in_transit', label: 'في الطريق', icon: IconTruck },
  { key: 'delivered', label: 'تم التسليم', icon: IconCheck },
]

const currentStepIndex = computed(() => {
  const s = String(delivery.value?.status || '').toLowerCase()
  return timelineSteps.findIndex(step => step.key === s)
})

const isStepConfigured = (idx: number) => {
  if (currentStepIndex.value === -1) return false
  return idx < currentStepIndex.value
}

const progressPercentage = computed(() => {
  if (currentStepIndex.value === -1) return 0
  if (currentStepIndex.value === 0) return 0
  return (currentStepIndex.value / (timelineSteps.length - 1)) * 100
})


const newStatus = ref<string>('')

const allowedStatusOptions = computed<{value:string, text:string}[]>(() => {
  const cur = String(delivery.value?.status || '').toLowerCase()
  const arr: string[] = allowedTransitions[cur] || []
  return arr
    .filter((s: string) => s !== 'assigned')
    .map((s: string) => ({ value: s, text: statusLabels[s] || s }))
})

const allowedStatusText = computed(() => allowedStatusOptions.value.map((o) => o.text).join('، '))
const isStatusInvalid = computed(() => !newStatus.value || !allowedStatusOptions.value.some(o => o.value === newStatus.value))

const canAssign = computed(() => (delivery.value?.status || '') === 'pending')
const canReassign = computed(() => ['assigned', 'picked_up', 'failed', 'returned'].includes((delivery.value?.status || '')))
const selectedFile = ref<File | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const { addToast } = useToast()

const getStatusColor = getDeliveryStatusColor

const load = async () => {
  loading.value = true
  try {
    const res = await fetchDelivery(id)
    delivery.value = res?.data?.data ?? res?.data ?? null
    newStatus.value = ''
    const pid = delivery.value?.provider_id ?? delivery.value?.provider?.id
    if (pid) {
      const rres = await fetchRiders(1, { provider_id: pid })
      const rd = rres?.data?.data ?? rres?.data ?? []
      ridersForProvider.value = rd
      if (delivery.value.rider_id) selectedRider.value = delivery.value.rider_id
    }
  } catch (e) {
    // console.error('Failed to load delivery', e) // removed
  } finally {
    loading.value = false
  }
}

const changeStatus = async () => {
  if (!delivery.value) return
  const cur = String(delivery.value.status || '').toLowerCase()
  const allowed = allowedTransitions[cur] || []
  if (!newStatus.value || !allowed.includes(newStatus.value)) {
    // alert('هذا الانتقال غير مسموح...') // Use toast instead?
    addToast('هذا الانتقال غير مسموح', 'error')
    return
  }

  const prev = delivery.value.status
  delivery.value.status = newStatus.value // optimistic
  saving.value = true
  try {
    const res = await updateDeliveryStatus(delivery.value.id, { status: newStatus.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
    addToast('تم تحديث حالة التوصيل', 'success')
    newStatus.value = ''
  } catch (err) {
    delivery.value.status = prev // revert
    addToast('فشل تحديث الحالة', 'error')
  } finally {
    saving.value = false
  }
}

const reassign = async () => {
  if (!delivery.value || !selectedRider.value) return

  const st = String(delivery.value.status || '').toLowerCase()
  if (!(st === 'pending' || ['assigned', 'picked_up', 'failed', 'returned'].includes(st))) {
    addToast('لا يمكن (تعيين/إعادة تعيين) المندوب في هذه الحالة', 'error')
    return
  }

  const prevRider = delivery.value.rider
  delivery.value.rider = ridersForProvider.value.find(r => r.id === selectedRider.value) ?? { id: selectedRider.value }
  saving.value = true
  try {
    const res = await assignRiderToDelivery(delivery.value.id, { rider_id: selectedRider.value })
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
    addToast('تم تعيين المندوب بنجاح', 'success')
  } catch (err) {
    delivery.value.rider = prevRider
    addToast('فشل إعادة التعيين', 'error')
  } finally {
    saving.value = false
  }
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0] ?? null
  selectedFile.value = f
}

const upload = async () => {
  if (!delivery.value || !selectedFile.value) return
  saving.value = true
  try {
    const res = await uploadProof(delivery.value.id, selectedFile.value)
    const updated = res?.data?.data ?? res?.data ?? null
    if (updated) delivery.value = { ...delivery.value, ...updated }
    addToast('تم رفع الملف بنجاح', 'success')
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (err) {
    addToast('فشل رفع الملف', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => load())

watch(() => route.params.id, (nv) => {
  if (nv) load()
})
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
