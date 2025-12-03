<template>
  <div class="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen" dir="rtl">
    <div class="max-w-6xl mx-auto">
      <!-- رأس الصفحة -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div class="mb-4 md:mb-0">
          <h1 class="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
          <p class="text-gray-600 mt-2">قم بإضافة وتعديل وحذف الفئات في نظامك</p>
          
          <!-- إحصائيات سريعة -->
          <div class="flex flex-wrap gap-4 mt-4">
            <div class="bg-white rounded-lg shadow-sm p-3 min-w-[120px]">
              <div class="text-sm text-gray-500">عدد الفئات</div>
              <div class="text-xl font-bold text-blue-600">{{ categories.length }}</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-3 min-w-[120px]">
              <div class="text-sm text-gray-500">الفئات الرئيسية</div>
              <div class="text-xl font-bold text-green-600">{{ rootCategories.length }}</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-3 min-w-[120px]">
              <div class="text-sm text-gray-500">الفئات الفرعية</div>
              <div class="text-xl font-bold text-purple-600">{{ childCategories.length }}</div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button 
            @click="() => openModal()" 
            class="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:from-blue-700 hover:to-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            إضافة فئة جديدة
          </button>
          
          <button 
            @click="load" 
            class="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            تحديث
          </button>
        </div>
      </div>

      <!-- محتوى الصفحة -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- فلترة وعناصر تحكم -->
        <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="بحث عن فئة..." 
                class="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <select 
              v-model="filterParent" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="all">جميع الفئات</option>
              <option value="root">الفئات الرئيسية فقط</option>
              <option value="child">الفئات الفرعية فقط</option>
            </select>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">ترتيب حسب:</span>
            <select 
              v-model="sortBy" 
              class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            >
              <option value="name">الاسم</option>
              <option value="children">عدد الفروع</option>
              <option value="created">الأحدث</option>
            </select>
          </div>
        </div>
        
        <!-- حالة التحميل -->
        <template v-if="loading">
          <div class="flex flex-col items-center justify-center py-12">
            <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <div class="text-lg text-gray-700">جاري تحميل الفئات...</div>
            <div class="text-sm text-gray-500 mt-1">يرجى الانتظار قليلاً</div>
          </div>
        </template>

        <!-- حالة عدم وجود فئات -->
        <template v-else-if="filteredCategories.length === 0">
          <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد فئات</h3>
            <p class="text-gray-600 mb-6 max-w-md">لم تقم بإضافة أي فئات بعد. يمكنك البدء بإضافة فئة جديدة للنظام.</p>
            <button 
              @click="() => openModal()" 
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة فئة جديدة
            </button>
          </div>
        </template>

        <!-- عرض الفئات -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            <div 
              v-for="cat in filteredCategories" 
              :key="cat.id" 
              class="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-200"
              :class="{ 'border-r-4 border-r-blue-500': !cat.parent_id, 'border-r-4 border-r-green-500': cat.parent_id }"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="cat.parent_id ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg text-gray-800">{{ cat.name }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span 
                        class="px-2 py-0.5 text-xs rounded-full"
                        :class="cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ cat.is_active ? 'نشط' : 'غير نشط' }}
                      </span>
                      <span 
                        v-if="cat.parent_id" 
                        class="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        فرعي
                      </span>
                      <span 
                        v-else 
                        class="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full"
                      >
                        رئيسي
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="relative">
                  <button 
                    @click="toggleActions(cat.id)"
                    class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  
                  <!-- قائمة الإجراءات -->
                  <div 
                    v-if="activeActions === cat.id" 
                    class="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                  >
                    <button 
                      @click="() => { openModal(cat); toggleActions(null); }" 
                      class="w-full text-right px-4 py-2.5 text-sm hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      تعديل
                    </button>
                    <button
                      @click="() => { goToCategoryProducts(cat.id); toggleActions(null); }"
                      class="w-full text-right px-4 py-2.5 text-sm hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 3h14v2H3V3zm0 4h14v10H3V7zm2 2v6h10V9H5z" />
                      </svg>
                      عرض المنتجات
                    </button>
                    <button 
                      @click="() => { remove(cat); toggleActions(null); }" 
                      class="w-full text-right px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      حذف
                    </button>
                  </div>
                </div>
              </div>
              
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ cat.description || 'لا يوجد وصف' }}</p>
              
              <div class="border-t border-gray-100 pt-4">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">
                    <div v-if="cat.parent" class="flex items-center gap-1">
                      <span>الفئة الأصل:</span>
                      <span class="font-medium text-gray-700">{{ cat.parent.name }}</span>
                    </div>
                    <div v-else class="text-gray-500">فئة رئيسية</div>
                  </div>
                  
                          <div class="flex items-center gap-4">
                              <div class="flex items-center gap-1 text-sm" :class="cat.children?.length ? 'text-blue-600' : 'text-gray-400'">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                </svg>
                                <span>{{ cat.children?.length || 0 }} فروع</span>
                              </div>

                            </div>
                </div>
                
                <!-- عرض الفروع المصغرة -->
                <div v-if="cat.children && cat.children.length > 0" class="mt-3">
                  <div class="text-xs text-gray-500 mb-1">الفروع:</div>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="child in cat.children.slice(0, 3)" 
                      :key="child.id" 
                      class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {{ child.name }}
                    </span>
                    <span 
                      v-if="cat.children.length > 3" 
                      class="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                    >
                      +{{ cat.children.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- مودال إضافة/تعديل الفئة -->
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      :class="show ? 'bg-black/50' : 'bg-black/0'"
      @click.self="closeModal"
    >
      <div 
        class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300"
        :class="show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold">{{ editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة' }}</h3>
              <p class="text-blue-100 text-sm mt-1">{{ editingId ? 'قم بتعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة' }}</p>
            </div>
            <button 
              @click="closeModal" 
              class="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form @submit.prevent="submit" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الفئة *</label>
            <input 
              v-model="form.name" 
              required 
              placeholder="أدخل اسم الفئة" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف الفئة</label>
            <textarea 
              v-model="form.description" 
              placeholder="أدخل وصفاً للفئة (اختياري)" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              rows="3"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الفئة الرئيسية</label>
              <select 
                v-model="form.parent_id" 
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option :value="null">فئة رئيسية (بدون أب)</option>
                <option 
                  v-for="c in availableParents" 
                  :key="c.id" 
                  :value="c.id"
                  :disabled="c.id === editingId"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">حالة الفئة</label>
              <div class="flex items-center h-12">
                <label class="inline-flex items-center gap-3 cursor-pointer">
                  <div class="relative">
                    <input 
                      type="checkbox" 
                      v-model="form.is_active" 
                      class="sr-only" 
                      :true-value="true"
                      :false-value="false"
                    />
                    <div 
                      class="block w-14 h-8 rounded-full transition-colors duration-300"
                      :class="form.is_active ? 'bg-green-500' : 'bg-gray-300'"
                    ></div>
                    <div 
                      class="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300"
                      :class="form.is_active ? 'transform translate-x-6' : ''"
                    ></div>
                  </div>
                  <span class="text-gray-700 font-medium">{{ form.is_active ? 'نشطة' : 'غير نشطة' }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ editingId ? 'تحديث الفئة' : 'إضافة الفئة' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCategories, createCategory, deleteCategory, updateCategory } from '../../api/categories'
import type { Category } from '../../api/categories'

const categories = ref<Category[]>([])
const loading = ref(false)
const show = ref(false)
const editingId = ref<number | null>(null)
const activeActions = ref<number | null>(null)
const searchQuery = ref('')
const filterParent = ref('all')
const sortBy = ref('name')

const form = ref({ 
  name: '', 
  description: '', 
  parent_id: null as number | null, 
  is_active: true 
})

// الحسابات المحسوبة
const rootCategories = computed(() => {
  return categories.value.filter(c => !c.parent_id)
})

const childCategories = computed(() => {
  return categories.value.filter(c => c.parent_id)
})

const availableParents = computed(() => {
  return categories.value.filter(c => c.id !== editingId.value)
})

const filteredCategories = computed(() => {
  let filtered = [...categories.value]
  
  // فلترة حسب البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.description && c.description.toLowerCase().includes(query))
    )
  }
  
  // فلترة حسب النوع (رئيسي/فرعي)
  if (filterParent.value === 'root') {
    filtered = filtered.filter(c => !c.parent_id)
  } else if (filterParent.value === 'child') {
    filtered = filtered.filter(c => c.parent_id)
  }
  
  // الترتيب
  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
  } else if (sortBy.value === 'children') {
    filtered.sort((a, b) => (b.children?.length || 0) - (a.children?.length || 0))
  }
  
  return filtered
})

// الدوال
const load = async () => {
  loading.value = true
  try {
    const res = await fetchCategories()
    categories.value = res?.data || []
  } catch (e) {
    console.error('Failed to fetch categories', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const router = useRouter()
const goToCategoryProducts = (catId?: number) => {
  if (!catId) return
  router.push({ name: 'CategoryProducts', params: { id: catId } })
}

const openModal = (cat?: Category) => {
  if (cat) {
    editingId.value = cat.id
    form.value = {
      name: cat.name || '',
      description: cat.description || '',
      parent_id: cat.parent_id ?? null,
      is_active: cat.is_active ?? true,
    }
  } else {
    editingId.value = null
    form.value = { name: '', description: '', parent_id: null, is_active: true }
  }
  show.value = true
}

const closeModal = () => {
  show.value = false
  editingId.value = null
}

const submit = async () => {
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await updateCategory(editingId.value, payload)
    } else {
      await createCategory(payload)
    }
    closeModal()
    await load()
  } catch (e) {
    console.error('Create/update category failed', e)
  }
}

const remove = async (cat: Category) => {
  if (!confirm(`هل أنت متأكد من حذف الفئة "${cat.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) return
  try {
    await deleteCategory(cat.id)
    await load()
  } catch (e) {
    console.error('Delete category failed', e)
  }
}

const toggleActions = (id: number | null) => {
  activeActions.value = activeActions.value === id ? null : id
}

// إغلاق قائمة الإجراءات عند النقر خارجها
onMounted(() => {
  const handler = (e: MouseEvent) => {
    const target = e.target as Element | null
    if (!target || !target.closest('.relative')) {
      activeActions.value = null
    }
  }
  document.addEventListener('click', handler)
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تأثيرات التمرير */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* تأثيرات الحركة */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>