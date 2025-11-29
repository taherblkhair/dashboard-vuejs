<script setup>
import StatCard from '../components/dashboard/StatCard.vue'
import LineChart from '../components/dashboard/LineChart.vue'
import DataTable from '../components/dashboard/DataTable.vue'

const stats = [
  { title: 'Total Revenue', value: '$45,231', icon: '💰', trend: 12.5, trendLabel: 'vs last month' },
  { title: 'Active Users', value: '2,345', icon: '👥', trend: 8.2, trendLabel: 'vs last week' },
  { title: 'New Orders', value: '1,234', icon: '📦', trend: -3.1, trendLabel: 'vs yesterday' },
  { title: 'Conversion Rate', value: '3.24%', icon: '📈', trend: 5.7, trendLabel: 'vs last month' }
]

const chartData = [30, 55, 45, 80, 65, 90, 75]
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const tableColumns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', type: 'status' }
]

const tableRows = [
  { id: '#ORD-001', customer: 'John Doe', product: 'Premium Plan', amount: '$299.00', status: 'completed' },
  { id: '#ORD-002', customer: 'Jane Smith', product: 'Basic Plan', amount: '$99.00', status: 'pending' },
  { id: '#ORD-003', customer: 'Bob Wilson', product: 'Enterprise', amount: '$599.00', status: 'completed' },
  { id: '#ORD-004', customer: 'Alice Brown', product: 'Premium Plan', amount: '$299.00', status: 'cancelled' },
  { id: '#ORD-005', customer: 'Charlie Lee', product: 'Basic Plan', amount: '$99.00', status: 'completed' }
]
</script>

<template>
  <div class="dashboard">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatCard
        v-for="(stat, index) in stats"
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :trend="stat.trend"
        :trend-label="stat.trendLabel"
      />
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <LineChart
        title="Weekly Revenue"
        :data="chartData"
        :labels="chartLabels"
        color="#42b883"
      />
    </div>

    <!-- Recent Orders Table -->
    <div class="table-section">
      <DataTable
        title="Recent Orders"
        :columns="tableColumns"
        :rows="tableRows"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.table-section {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
