<template>
  <div dir="rtl" class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">إدارة الفئات</h1>
          <p class="text-slate-500 font-medium">نظم منتجاتك من خلال تصنيفات هرمية مرنة</p>
        </div>

        <div class="flex items-center gap-3">
          <MButton
            variant="secondary"
            size="sm"
            @click="load"
            :loading="loading"
            class="!rounded-xl"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </template>
            تحديث
          </MButton>
          <MButton
            variant="primary"
            class="!rounded-2xl shadow-lg shadow-indigo-100"
            @click="() => openModal()"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </template>
            إضافة فئة جديدة
          </MButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
             </svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">إجمالي الفئات</p>
            <p class="text-2xl font-black text-slate-900 leading-none">{{ categories.length }}</p>
          </div>
        </MCard>

        <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
             </svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">فئات رئيسية</p>
            <p class="text-2xl font-black text-slate-900 leading-none">{{ rootCategories.length }}</p>
          </div>
        </MCard>

        <MCard class="!p-6 !rounded-[2rem] border-none shadow-sm bg-white flex items-center gap-4">
          <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">فئات فرعية</p>
            <p class="text-2xl font-black text-slate-900 leading-none">{{ childCategories.length }}</p>
          </div>
        </MCard>
      </div>

      <!-- Filters Row -->
      <MCard class="!p-4 !rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
            <div class="relative flex-1 max-w-md">
              <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <MInput
                v-model="searchQuery"
                placeholder="ابحث عن اسم الفئة..."
                class="!pr-12 !rounded-2xl"
              />
            </div>

            <select 
              v-model="filterParent"
              class="h-12 px-4 rounded-2xl border-none bg-white ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700 max-w-[200px]"
            >
              <option value="all">الكل</option>
              <option value="root">الرئيسية</option>
              <option value="child">الفرعية</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ترتيب:</span>
            <select 
              v-model="sortBy"
              class="px-3 py-2 rounded-xl border-none bg-transparent font-bold text-xs text-slate-600 focus:ring-0 cursor-pointer"
            >
              <option value="name">الاسم</option>
              <option value="children">عدد الفروع</option>
              <option value="created">الأحدث</option>
            </select>
          </div>
        </div>
      </MCard>

      <!-- Content -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">جاري التحميل...</p>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
        <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-xl font-black text-slate-900">لا توجد فئات مطابقة</h3>
          <p class="text-slate-400 font-medium">ابدأ بإضافة فئات جديدة لبناء هيكل منتجاتك</p>
        </div>
        <MButton variant="primary" size="lg" @click="() => openModal()" class="!rounded-2xl">
          إضافة أول فئة
        </MButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cat in filteredCategories" 
          :key="cat.id"
          class="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 flex flex-col"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm overflow-hidden"
              :class="cat.parent_id ? 'bg-emerald-50 text-emerald-600 shadow-emerald-50' : 'bg-indigo-50 text-indigo-600 shadow-indigo-50'"
            >
              <img v-if="cat.images && cat.images.length > 0" :src="getImageUrl(cat.images[0]?.url || '')" class="w-full h-full object-cover" />
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            
            <ActionMenu :items="[
              { label: 'تعديل البيانات', action: () => openModal(cat), icon: 'Edit' },
              { label: 'عرض المنتجات', action: () => goToCategoryProducts(cat.id), icon: 'Eye' },
              { label: 'حذف الفئة', action: () => remove(cat), variant: 'danger', icon: 'Trash' }
            ]" />
          </div>

          <div class="space-y-1 mb-4 flex-1">
            <h3 class="text-xl font-black text-slate-900 tracking-tight leading-tight">{{ cat.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <MBadge :variant="cat.is_active ? 'success' : 'danger'" class="!rounded-lg !px-2.5 !py-0.5 !text-[10px] !font-black uppercase tracking-widest leading-none">
                {{ cat.is_active ? 'نشط' : 'غير نشط' }}
              </MBadge>
              <MBadge :variant="cat.parent_id ? 'info' : 'neutral'" class="!rounded-lg !px-2.5 !py-0.5 !text-[10px] !font-black uppercase tracking-widest leading-none">
                {{ cat.parent_id ? 'فرعي' : 'رئيسي' }}
              </MBadge>
            </div>
            <p class="text-slate-500 text-sm font-medium mt-3 leading-relaxed line-clamp-2">{{ cat.description || 'لا يوجد وصف تعريفي لهذه الفئة.' }}</p>
          </div>

          <div class="mt-auto space-y-4 pt-6 border-t border-slate-50">
            <div class="flex items-center justify-between">
               <div class="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {{ cat.parent ? 'يتبع لـ: ' + cat.parent.name : 'فئة مستقلة' }}
               </div>
               <div class="flex items-center gap-1.5 text-indigo-600">
                  <span class="text-lg font-black leading-none">{{ cat.children?.length || 0 }}</span>
                  <span class="text-[10px] font-black uppercase tracking-widest">فرع</span>
               </div>
            </div>

            <div v-if="cat.children && cat.children.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="child in cat.children.slice(0, 3)" :key="child.id" class="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white transition-colors cursor-default">
                {{ child.name }}
              </span>
              <span v-if="cat.children.length > 3" class="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">
                +{{ cat.children.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Layout Refactor to match Form Premium Style -->
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <MCard class="relative w-full max-w-lg !p-0 !rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in duration-300">
        <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ editingId ? 'تعديل الفئة' : 'إضافة فئة' }}</h3>
            <p class="text-slate-400 text-xs font-medium">أكمل البيانات الأساسية للفئة لحفظ التغييرات</p>
          </div>
          <button @click="closeModal" class="p-2 text-slate-400 hover:bg-white rounded-xl transition-all shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submit" class="p-8 space-y-6">
          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">اسم الفئة <span class="text-rose-500">*</span></label>
            <MInput v-model="form.name" placeholder="مثلاً: ملابس رجالية" class="!rounded-2xl" required />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-black text-slate-700 block px-1">الوصف</label>
            <textarea 
              v-model="form.description" 
              rows="3" 
              placeholder="اكتب وصفاً مختصراً للفئة..."
              class="w-full p-4 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-600 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-black text-slate-700 block px-1">الفئة الأب</label>
              <select 
                v-model="form.parent_id" 
                class="w-full h-14 px-4 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm text-slate-700"
              >
                <option :value="null">فئة رئيسية</option>
                <option v-for="c in availableParents" :key="c.id" :value="c.id" :disabled="c.id === editingId">{{ c.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-black text-slate-700 block px-1">الحالة</label>
              <div class="flex items-center h-14 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input type="checkbox" v-model="form.is_active" id="modal-active" class="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-600 transition-all" />
                <label for="modal-active" class="mr-3 text-sm font-black text-slate-700">{{ form.is_active ? 'نشطة' : 'غير نشطة' }}</label>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="space-y-3">
            <label class="text-sm font-black text-slate-700 block px-1">صورة الفئة</label>
            <div class="flex items-start gap-4">
              <div 
                class="w-24 h-24 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group/img relative cursor-pointer"
                @click="fileInput?.click()"
              >
                <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                <div v-else class="text-slate-300 group-hover/img:text-indigo-400 transition-colors">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1 space-y-2">
                <input 
                  type="file" 
                  ref="fileInput" 
                  class="hidden" 
                  accept="image/*"
                  @change="handleFileChange"
                />
                <p class="text-[10px] font-medium text-slate-400 leading-relaxed">
                  ارفع صورة تعبيرية للفئة (JPG, PNG).<br>
                  الحد الأقصى للحجم: 2MB.
                </p>
                <MButton 
                  v-if="imagePreview" 
                  variant="secondary" 
                  size="sm" 
                  type="button" 
                  @click="clearImage"
                  class="!py-1 !px-3 !h-8 !text-[10px] !rounded-lg !text-rose-600 hover:!bg-rose-50 border-none"
                >
                  إزالة الصورة
                </MButton>
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-3">
             <MButton variant="secondary" size="lg" type="button" @click="closeModal" class="flex-1 !rounded-2xl">إلغاء</MButton>
             <MButton variant="primary" size="lg" type="submit" class="flex-[2] !rounded-2xl shadow-lg shadow-indigo-100" :loading="loading">
                {{ editingId ? 'حفظ التغييرات' : 'إضافة الفئة' }}
             </MButton>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCategories, createCategory, deleteCategory, updateCategory } from '../../api/categories'
import type { Category } from '../../api/categories'
import MCard from '../../components/ui/MCard.vue'
import MButton from '../../components/ui/MButton.vue'
import MInput from '../../components/ui/MInput.vue'
import MBadge from '../../components/ui/MBadge.vue'
import ActionMenu from '../../components/ui/ActionMenu.vue'

const categories = ref<Category[]>([])
const loading = ref(false)
const show = ref(false)
const editingId = ref<number | null>(null)
const searchQuery = ref('')
const filterParent = ref('all')
const sortBy = ref('name')

const form = ref({ 
  name: '', 
  description: '', 
  parent_id: null as number | null, 
  is_active: true 
})
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://127.0.0.1:8000${url}`
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
  }
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Calculations
const rootCategories = computed(() => categories.value.filter(c => !c.parent_id))
const childCategories = computed(() => categories.value.filter(c => c.parent_id))
const availableParents = computed(() => categories.value.filter(c => c.id !== editingId.value))

const filteredCategories = computed(() => {
  let filtered = [...categories.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)))
  }
  if (filterParent.value === 'root') filtered = filtered.filter(c => !c.parent_id)
  else if (filterParent.value === 'child') filtered = filtered.filter(c => c.parent_id)
  
  if (sortBy.value === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
  else if (sortBy.value === 'children') filtered.sort((a, b) => (b.children?.length || 0) - (a.children?.length || 0))
  else if (sortBy.value === 'created') filtered.sort((a, b) => (b.id - a.id)) // Fallback if no created_at
  
  return filtered
})

// Methods
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
    imagePreview.value = (cat.images && cat.images.length > 0) ? getImageUrl(cat.images[0]?.url || '') : null
    imageFile.value = null
  } else {
    editingId.value = null
    form.value = { name: '', description: '', parent_id: null, is_active: true }
    imagePreview.value = null
    imageFile.value = null
  }
  show.value = true
}

const closeModal = () => {
  show.value = false
  editingId.value = null
}

const submit = async () => {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    if (form.value.description) {
      fd.append('description', form.value.description)
    }
    fd.append('is_active', form.value.is_active ? '1' : '0')
    
    if (form.value.parent_id !== null && form.value.parent_id !== undefined) {
      fd.append('parent_id', String(form.value.parent_id))
    }
    
    if (imageFile.value) {
      fd.append('image', imageFile.value)
    }

    if (editingId.value) {
      fd.append('_method', 'PUT')
      await updateCategory(editingId.value, fd)
    } else {
      await createCategory(fd)
    }
    closeModal()
    await load()
  } catch (e: any) {
    console.error('Submit failed details:', e)
    let errorMessage = 'فشل في حفظ الفئة'
    try {
      const errorData = JSON.parse(e.message)
      if (errorData.message) errorMessage += ': ' + errorData.message
      if (errorData.errors) {
        const firstError = Object.values(errorData.errors)[0] as string[]
        if (firstError) errorMessage += ' (' + firstError[0] + ')'
      }
    } catch {
      errorMessage += ': ' + (e.message || 'خطأ غير معروف')
    }
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

const remove = async (cat: Category) => {
  if (!confirm(`هل أنت متأكد من حذف الفئة "${cat.name}"؟`)) return
  try {
    await deleteCategory(cat.id)
    await load()
  } catch (e) {
    console.error('Delete failed', e)
  }
}

onMounted(load)
</script>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.zoom-in { animation-name: zoom-in; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>