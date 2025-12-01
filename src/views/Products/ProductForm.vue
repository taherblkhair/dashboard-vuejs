<template>
  <form @submit.prevent="onSubmit" class="space-y-4">

    <!-- البيانات الأساسية -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-gray-700 mb-1">اسم المنتج</label>
        <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">SKU</label>
        <input v-model="form.sku" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">الفئة</label>
        <select v-model="form.category_id" class="w-full px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">حدد فئة</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">الحالة</label>
        <div class="flex items-center gap-3">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="form.is_active" class="rounded" />
            <span class="text-sm text-gray-700">نشط</span>
          </label>
        </div>
      </div>
    </div>

    <!-- الوصف -->
    <div>
      <label class="block text-sm text-gray-700 mb-1">الوصف</label>
      <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg"></textarea>
    </div>

    <!-- المتغيرات -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="block text-sm text-gray-700">المتغيرات</label>
        <button type="button"
                @click="addVariant"
                class="px-3 py-1 bg-green-600 text-white rounded">
          + إضافة متغير
        </button>
      </div>

      <div v-for="(v, i) in form.variants" :key="v.id"
           class="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-700">SKU المتغير</label>
            <input v-model="v.sku_variant" type="text"
                   class="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label class="text-xs text-gray-700">سعر الشراء</label>
            <input v-model="v.purchase_price" type="number"
                   class="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label class="text-xs text-gray-700">سعر البيع</label>
            <input v-model="v.sale_price" type="number"
                   class="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <!-- الخصائص الثابتة -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-700">اللون</label>
            <select v-model="v.attributes.color" class="w-full px-3 py-2 border rounded-lg">
              <option value="">اختر لون</option>
              <option value="red">أحمر</option>
              <option value="blue">أزرق</option>
              <option value="black">أسود</option>
              <option value="white">أبيض</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-700">المقاس</label>
            <select v-model="v.attributes.size" class="w-full px-3 py-2 border rounded-lg">
              <option value="">اختر مقاس</option>
              <option value="S">صغير (S)</option>
              <option value="M">متوسط (M)</option>
              <option value="L">كبير (L)</option>
              <option value="XL">XL</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-700">الحجم</label>
            <input type="text"
                   v-model="v.attributes.weight"
                   placeholder="مثال: 1kg"
                   class="px-3 py-2 border rounded-lg w-full" />
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-700">تاريخ الانتهاء</label>
          <input v-model="v.expiry_date" type="date"
                 class="px-3 py-2 border rounded-lg w-full" />
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="v.is_active" />
          <span class="text-sm text-gray-700">نشط</span>
        </div>

        <button type="button"
                @click="removeVariant(i)"
                class="text-red-600 text-sm">
          حذف المتغير
        </button>
      </div>
    </div>

    <!-- الأزرار -->
    <div class="flex justify-end gap-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700">إلغاء</button>
      <button :disabled="props.loading" type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2">
        <svg v-if="props.loading" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span>حفظ</span>
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Category { id: number; name: string }

const props = defineProps<{ categories?: Category[], loading?: boolean }>()
const emit = defineEmits(['save', 'close'])

const categories = props.categories || []

const form = reactive({
  name: '',
  sku: '',
  description: '',
  category_id: '',
  is_active: true,
  variants: [] as any[]
})

/* إضافة متغير جديد */
const addVariant = () => {
  form.variants.push({
    id: `v-${Date.now()}`,
    sku_variant: '',
    purchase_price: 0,
    sale_price: 0,
    expiry_date: '',
    is_active: true,
    attributes: {
      color: '',
      size: '',
      weight: ''
    }
  })
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
}

/* إرسال النموذج */
const onSubmit = () => {
  emit('save', {
    name: form.name,
    sku: form.sku,
    description: form.description,
    category_id: form.category_id || undefined,
    is_active: form.is_active,
    variants: form.variants
  })
}
</script>