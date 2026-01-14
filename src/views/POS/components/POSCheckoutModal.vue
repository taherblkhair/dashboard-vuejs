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

        <!-- 2. Payment Method -->
        <div class="space-y-3">
           <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest px-1">طريقة الدفع</h4>
           <div class="grid grid-cols-2 gap-4">
             <button 
                @click="paymentMethod = 'cash'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center"
                :class="paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-100 bg-white hover:border-indigo-100 text-slate-500'"
             >
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
               <span class="font-bold text-sm">نقداً (Cash)</span>
             </button>
             <button 
                @click="paymentMethod = 'card'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center"
                :class="paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-100 bg-white hover:border-indigo-100 text-slate-500'"
             >
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
               <span class="font-bold text-sm">بطاقة (Card)</span>
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
          :disabled="processing || !customerId"
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
import { fetchCustomer } from '../../../api/customers'
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
const paymentMethod = ref('cash')
const discount = ref(0)
const processing = ref(false)

const finalTotal = computed(() => {
  return Math.max(0, props.cartTotal - discount.value)
})

const onCustomerSelect = async (customer: any) => {
  selectedCustomer.value = customer
  customerId.value = customer?.id || null
  deliveryAddressId.value = null
  billingAddressId.value = null

  if (customer?.id) {
    try {
      const res = await fetchCustomer(customer.id)
      const fullCustomer = res.data
      if (fullCustomer && fullCustomer.addresses && fullCustomer.addresses.length > 0) {
        // Use default address if available, otherwise first address
        const defaultAddr = fullCustomer.addresses.find((a: any) => a.id === fullCustomer.default_address_id) || fullCustomer.addresses[0]
        deliveryAddressId.value = defaultAddr.id
        billingAddressId.value = defaultAddr.id
      }
    } catch (e) {
      console.error('Failed to fetch customer details', e)
    }
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
      notes: `POS Order - Payment: ${paymentMethod.value.toUpperCase()}`,
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
