<script setup>
import LineChart from '../components/dashboard/LineChart.vue'
import StatCard from '../components/dashboard/StatCard.vue'

const weeklyData = [120, 180, 150, 220, 200, 280, 250]
const monthlyData = [450, 520, 480, 620, 580, 720, 680]

const analyticsStats = [
  { title: 'Page Views', value: '124,523', icon: '👁️', trend: 15.3, trendLabel: 'vs last week' },
  { title: 'Bounce Rate', value: '42.3%', icon: '↩️', trend: -2.8, trendLabel: 'vs last week' },
  { title: 'Avg. Session', value: '4m 32s', icon: '⏱️', trend: 8.1, trendLabel: 'vs last week' },
  { title: 'Goal Completion', value: '78.5%', icon: '🎯', trend: 12.4, trendLabel: 'vs last week' }
]
</script>

<template>
  <div class="analytics">
    <!-- Analytics Stats -->
    <div class="stats-grid">
      <StatCard
        v-for="(stat, index) in analyticsStats"
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :trend="stat.trend"
        :trend-label="stat.trendLabel"
      />
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <LineChart
        title="Weekly Traffic"
        :data="weeklyData"
        :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
        color="#3b82f6"
      />
      <LineChart
        title="Monthly Revenue"
        :data="monthlyData"
        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
        color="#8b5cf6"
      />
    </div>
  </div>
</template>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .stats-grid,
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
