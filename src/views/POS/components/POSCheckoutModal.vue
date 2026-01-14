<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="close"></div>

    <div class="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div>
             <h3 class="text-2xl font-black text-slate-900 leading-tight">إتمام البيع</h3>
             <p class="text-sm font-bold text-slate-400">مراجعة الطلب واختيار الدفع</p>
          </div>
        </div>
        <button @click="close" class="p-2 text-slate-400 hover:bg-white hover:text-rose-500 rounded-xl transition-all shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 space-y-8">
        <!-- 1. Customer Selection -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">العميل</h4>
          <div class="bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <CustomerAutocomplete 
              v-model="customerId"
              @select="onCustomerSelect"
              placeholder="ابحث عن عميل (الاسم أو الهاتف)..."
              class="w-full !border-none !ring-0 !bg-transparent"
            />
          </div>
          <div v-if="selectedCustomer" class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="font-bold text-sm">{{ selectedCustomer.name }} ({{ selectedCustomer.phone }})</span>
          </div>
        </div>

        <!-- 2. Delivery Address Display -->
        <div class="space-y-3" v-if="selectedAddress">
           <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">عنوان التوصيل</h4>
           <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm font-bold flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
             </div>
             <span>{{ selectedAddress.city }} - {{ selectedAddress.area }} {{ selectedAddress.street ? `- ${selectedAddress.street}` : '' }}</span>
           </div>
        </div>
        <div class="space-y-3" v-else-if="selectedCustomer">
           <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">عنوان التوصيل</h4>
           
           <!-- Warning if no address -->
           <div v-if="!showAddressForm" class="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 text-sm font-bold flex flex-col gap-3">
             <div class="flex items-center gap-3">
               <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               <span>هذا العميل ليس لديه عنوان مسجل.</span>
             </div>
             <button @click="showAddressForm = true" class="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors text-xs font-black">
               + إضافة عنوان جديد
             </button>
           </div>

           <!-- Add Address Form -->
           <div v-else class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2">
             <div class="flex items-center justify-between mb-2">
               <h5 class="font-bold text-slate-700 text-xs">إضافة عنوان جديد</h5>
               <button @click="showAddressForm = false" class="text-xs text-slate-400 hover:text-rose-500">إلغاء</button>
             </div>
             
             <div class="grid grid-cols-2 gap-3">
               <div>
                 <label class="block text-[10px] font-bold text-slate-400 mb-1">المدينة</label>
                 <input v-model="newAddress.city" type="text" class="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="الرياض" />
               </div>
               <div>
                 <label class="block text-[10px] font-bold text-slate-400 mb-1">المنطقة</label>
                 <input v-model="newAddress.area" type="text" class="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="العليا" />
               </div>
               <div class="col-span-2">
                 <label class="block text-[10px] font-bold text-slate-400 mb-1">الشارع</label>
                 <input v-model="newAddress.street" type="text" class="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="شارع الملك فهد" />
               </div>
               <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">المبنى (اختياري)</label>
                  <input v-model="newAddress.building" type="text" class="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
             </div>

             <button 
               @click="saveNewAddress" 
               :disabled="savingAddress || !newAddress.city"
               class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
             >
               {{ savingAddress ? 'جاري الحفظ...' : 'حفظ العنوان' }}
             </button>
           </div>
        </div>

        <!-- 3. Summary -->
        <div class="space-y-3">
           <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">ملخص الطلب</h4>
           <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
             <div class="flex items-center justify-between text-sm text-slate-500 font-bold">
               <span>عدد الأصناف</span>
               <span>{{ cartCount }}</span>
             </div>
             
             <!-- Discount? -->
             <div class="flex items-center justify-between text-sm">
               <span class="text-slate-500 font-bold">الخصم</span>
               <div class="flex items-center gap-2">
                 <input v-model.number="discount" type="number" min="0" class="w-20 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                 <span class="text-xs font-bold text-slate-400">د.ل</span>
               </div>
             </div>

             <div class="h-px bg-slate-200 my-2"></div>
             
             <div class="flex items-center justify-between">
               <span class="text-base font-black text-slate-900">الإجمالي النهائي</span>
               <span class="text-2xl font-black text-indigo-600">{{ formatCurrency(finalTotal) }}</span>
             </div>
           </div>
        </div>
      </div>

       <!-- Footer -->
      <div class="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-4">
        <button 
          @click="close"
          class="px-8 py-4 bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-colors"
        >
          إلغاء
        </button>
        <button 
          @click="handleCheckout"
          class="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          :disabled="processing || !customerId || !selectedAddress "
        >
          <span v-if="processing">جاري التنفيذ...</span>
          <span v-else>تأكيد ودفع</span>
          <svg v-if="!processing" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomerAutocomplete from '../../../components/CustomerAutocomplete.vue'
import { formatCurrency } from '../../../utils/helpers'
import { createOrder } from '../../../api/orders'
import { fetchCustomer, createCustomerAddress } from '../../../api/customers'
import { usePosStore } from '../../../stores/pos'
import { useToast } from '../../../composables/useToast'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
  cartTotal: number
  cartCount: number
}>()

const emit = defineEmits(['close', 'completed'])

const posStore = usePosStore()
const { addToast } = useToast()
const router = useRouter()

const customerId = ref<number | null>(null)
const selectedCustomer = ref<any>(null)
const deliveryAddressId = ref<number | null>(null)
const billingAddressId = ref<number | null>(null)
const selectedAddress = ref<any>(null)
const discount = ref(0)
const processing = ref(false)

// Address Creation
const showAddressForm = ref(false)
const savingAddress = ref(false)
const newAddress = ref({ city: '', area: '', street: '', building: '', notes: '' })

const finalTotal = computed(() => {
  return Math.max(0, props.cartTotal - discount.value)
})

const onCustomerSelect = async (customer: any) => {
  selectedCustomer.value = customer
  customerId.value = customer?.id || null
  deliveryAddressId.value = null
  billingAddressId.value = null
  selectedAddress.value = null
  showAddressForm.value = false

  if (customer?.id) {
    try {
      const res = await fetchCustomer(customer.id)
      const fullCustomer = res.data
      if (fullCustomer && fullCustomer.addresses && fullCustomer.addresses.length > 0) {
        // Use default address if available, otherwise first address
        const defaultAddr = fullCustomer.addresses.find((a: any) => a.id === fullCustomer.default_address_id) || fullCustomer.addresses[0]
        deliveryAddressId.value = defaultAddr.id
        billingAddressId.value = defaultAddr.id
        selectedAddress.value = defaultAddr
      }
    } catch (e) {
      console.error('Failed to fetch customer details', e)
    }
  }
}

const saveNewAddress = async () => {
  if (!customerId.value || !newAddress.value.city) return

  savingAddress.value = true
  console.log('Saving address for customer:', customerId.value, newAddress.value)
  
  try {
    // Attempt to use the specific customer address endpoint first
    // This avoids potentially strict polymorphic validation on the generic /addresses endpoint if it checks exists:users
    const payload = { ...newAddress.value }
    console.log('Using createCustomerAddress:', payload)
    
    // api/customers.ts: createCustomerAddress(customerId, payload)
    const res: any = await createCustomerAddress(customerId.value, payload)
    console.log('Address API Response:', res)
    
    const createdAddr = res.data || res

    if (createdAddr && createdAddr.id) {
       addToast('تم إضافة العنوان بنجاح', 'success')
       // Auto select
       selectedAddress.value = createdAddr
       deliveryAddressId.value = createdAddr.id
       billingAddressId.value = createdAddr.id
       showAddressForm.value = false
       // Reset
       newAddress.value = { city: '', area: '', street: '', building: '', notes: '' }
    } else {
      console.warn('Response did not contain ID:', createdAddr)
      addToast('لم يتم استلام معرف العنوان من الخادم', 'error')
    }
  } catch (e: any) {
    console.error('Failed to create address', e)
    let msg = 'فشل إضافة العنوان'
    if (e.message) msg = e.message
    try {
        const parsed = JSON.parse(e.message)
        if (parsed.message) msg = parsed.message
        if (parsed.errors) {
             const firstKey = Object.keys(parsed.errors)[0]
             if (firstKey) msg += `: ${parsed.errors[firstKey][0]}`
        }
    } catch {}
    addToast(msg, 'error')
  } finally {
    savingAddress.value = false
  }
}

const close = () => {
  emit('close')
}

const handleCheckout = async () => {
  if (!customerId.value) {
    addToast('يرجى اختيار العميل أولاً', 'error')
    return
  }

  processing.value = true
  try {
    const payload = {
      customer_id: customerId.value,
      source: 'internal',
      discount_amount: discount.value,
      shipping_fee: 0,
      delivery_date: null,
      delivery_time_slot: null,
      delivery_address_id: deliveryAddressId.value,
      billing_address_id: billingAddressId.value,
      notes: `POS Order`,
      lines: posStore.cart.map(item => ({
        product_variant_id: item.variant.id,
        quantity: item.quantity,
        unit_price: Number(item.variant.sale_price),
        discount_amount: 0 // Item level discount implementation can be added later
      }))
    }

    const res = await createOrder(payload)
    addToast('تم إنشاء الطلب بنجاح', 'success')
    emit('completed')
    
    // Optionally navigate to order details or just stay in POS and clear cart
    // For POS, staying is usually better. 
    close()
    
    // Maybe open print invoice?
    // if (res.data.id) window.open(...)
    
  } catch (e: any) {
    console.error('Checkout Error:', e)
    let msg = 'فشل إنشاء الطلب'
    if (e.message) msg = e.message
    try {
        const parsed = JSON.parse(e.message)
        if (parsed.message) msg = parsed.message
        if (parsed.errors) {
            // Extract first error
            const firstKey = Object.keys(parsed.errors)[0]
            if (firstKey) msg += `: ${parsed.errors[firstKey][0]}`
        }
    } catch {}
    
    addToast(msg, 'error')
  } finally {
    processing.value = false
  }
}
</script>
