<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  trend: {
    type: Number,
    default: 0
  },
  trendLabel: {
    type: String,
    default: 'vs last period'
  }
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon">{{ icon }}</div>
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <p class="stat-value">{{ value }}</p>
      <div class="stat-trend" :class="{ positive: trend > 0, negative: trend < 0 }">
        <span v-if="trend > 0">↑</span>
        <span v-else-if="trend < 0">↓</span>
        <span>{{ Math.abs(trend) }}% {{ trendLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  background: #f0f9ff;
  padding: 12px;
  border-radius: 10px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  margin: 8px 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-trend {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}
</style>
