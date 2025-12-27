<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">إضافة مخزن جديد</h1>
        <p class="text-sm text-gray-500 mt-1">أدخل بيانات المخزن ثم اضغط حفظ للإنشاء</p>
      </div>
      <MButton variant="secondary" @click="cancel">
        إلغاء
      </MButton>
    </div>

    <MCard>
      <form @submit.prevent="submit" class="space-y-8 p-4">
        <!-- Basic Info -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
            البيانات الأساسية
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                اسم المخزن <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="مثال: المخزن الرئيسي"
              />
              <span v-if="errors.name" class="text-xs text-red-600">{{ errors.name }}</span>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                رمز المخزن <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.code" 
                type="text" 
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                placeholder="مثال: WH-MAIN"
              />
              <span v-if="errors.code" class="text-xs text-red-600">{{ errors.code }}</span>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-green-500 rounded-full"></span>
            معلومات الاتصال
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
              <input 
                v-model="form.phone" 
                type="text" 
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="091xxxxxxx"
              />
              <span v-if="errors.phone" class="text-xs text-red-600">{{ errors.phone }}</span>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="example@company.com"
              />
              <span v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</span>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Settings -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-purple-500 rounded-full"></span>
            الإعدادات
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">السعة (وحدة)</label>
              <input 
                v-model.number="form.capacity" 
                type="number" 
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <span v-if="errors.capacity" class="text-xs text-red-600">{{ errors.capacity }}</span>
            </div>

            <div class="space-y-2">
               <label class="block text-sm font-medium text-gray-700">المدير المسؤول</label>
               <select 
                 v-model="form.manager_id"
                 class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
               >
                 <option :value="undefined">اختر المدير...</option>
                 <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
               </select>
            </div>

            <div class="space-y-2">
               <label class="block text-sm font-medium text-gray-700">العنوان</label>
               <select 
                 v-model="form.address_id"
                 class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
               >
                 <option :value="undefined">اختر العنوان...</option>
                 <option v-for="a in addresses" :key="a.id" :value="a.id">{{ a.city }} - {{ a.area }}</option>
               </select>
            </div>

            <div class="flex items-end">
               <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg w-full cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="form.is_active" class="rounded text-blue-600 focus:ring-blue-500 w-5 h-5 border-gray-300" />
                  <div>
                    <span class="block text-sm font-medium text-gray-900">نشط</span>
                    <span class="block text-xs text-gray-500">المخزن متاح للاستخدام</span>
                  </div>
               </label>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />
        
        <!-- Notes -->
        <div class="space-y-2">
           <label class="block text-sm font-medium text-gray-700">ملاحظات</label>
           <textarea 
             v-model="form.notes"
             rows="3"
             class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
           <MButton variant="secondary" @click="cancel">إلغاء</MButton>
           <MButton variant="primary" type="submit" :loading="loading">
             {{ loading ? 'جاري الحفظ...' : 'حفظ المخزن' }}
           </MButton>
        </div>
      </form>
    </MCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createWarehouse } from '../../api/warehouses'
import { fetchAddresses } from '../../api/addresses'
import { fetchUsers } from '../../api/users'
import { useToast } from '../../composables/useToast'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'

const router = useRouter()
const { addToast } = useToast()

const form = reactive<any>({
  name: '',
  code: '',
  address_id: undefined,
  manager_id: undefined,
  phone: '',
  email: '',
  capacity: undefined,
  notes: '',
  is_active: true
})

const errors = reactive<any>({})
const loading = ref(false)
const addresses = ref<any[]>([])
const users = ref<any[]>([])

const loadData = async () => {
    try {
        const [aRes, uRes] = await Promise.all([fetchAddresses(), fetchUsers()])
        addresses.value = aRes?.data?.data || aRes?.data || []
        users.value = uRes?.data?.data || uRes?.data || []
    } catch (e) {
        console.error(e)
    }
}

onMounted(loadData)

const validate = () => {
   let valid = true
   errors.name = ''
   errors.code = ''
   
   if (!form.name) {
       errors.name = 'الاسم مطلوب'
       valid = false
   }
   if (!form.code) {
       errors.code = 'الرمز مطلوب'
       valid = false
   }
   return valid
}

const submit = async () => {
    if (!validate()) return
    loading.value = true
    try {
        const payload = { ...form }
        // cleanup empty
        if (!payload.capacity) delete payload.capacity
        if (!payload.address_id) delete payload.address_id
        if (!payload.manager_id) delete payload.manager_id
        
        await createWarehouse(payload)
        addToast('تم إنشاء المخزن بنجاح', 'success')
        router.push({ name: 'Warehouses' })
    } catch (e: any) {
        console.error(e)
        addToast(e?.response?.data?.message || 'فشل الإنشاء', 'error')
    } finally {
        loading.value = false
    }
}

const cancel = () => {
    router.push({ name: 'Warehouses' })
}

</script>