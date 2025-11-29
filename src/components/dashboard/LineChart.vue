<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Chart'
  },
  data: {
    type: Array,
    default: () => [40, 65, 45, 80, 55, 70, 60]
  },
  labels: {
    type: Array,
    default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  color: {
    type: String,
    default: '#42b883'
  }
})

const chartHeight = 200
const chartWidth = 600

const hasData = computed(() => props.data && props.data.length > 0)

const maxValue = computed(() => {
  if (!hasData.value) return 100
  return Math.max(...props.data) * 1.2
})

const points = computed(() => {
  if (!hasData.value) return []
  const xStep = chartWidth / Math.max(props.data.length - 1, 1)
  return props.data.map((value, index) => {
    const x = index * xStep
    const y = chartHeight - (value / maxValue.value) * chartHeight
    return { x, y, value }
  })
})

const displayLabels = computed(() => {
  return props.labels.slice(0, props.data.length)
})

const linePath = computed(() => {
  return points.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const path = points.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  return `${path} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
})
</script>

<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <svg :viewBox="`0 0 ${chartWidth} ${chartHeight + 30}`" class="chart-svg">
        <!-- Grid lines -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="i"
            x1="0"
            :y1="(chartHeight / 5) * i"
            :x2="chartWidth"
            :y2="(chartHeight / 5) * i"
            stroke="#e5e7eb"
            stroke-dasharray="4"
          />
        </g>

        <!-- Area fill -->
        <path :d="areaPath" :fill="color" fill-opacity="0.1" />

        <!-- Line -->
        <path :d="linePath" fill="none" :stroke="color" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Points -->
        <g class="data-points">
          <circle
            v-for="(point, index) in points"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            r="5"
            :fill="color"
            stroke="white"
            stroke-width="2"
          />
        </g>

        <!-- Labels -->
        <g class="x-labels">
          <text
            v-for="(label, index) in displayLabels"
            :key="index"
            :x="points[index]?.x ?? 0"
            :y="chartHeight + 20"
            text-anchor="middle"
            fill="#6b7280"
            font-size="12"
          >
            {{ label }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  margin: 0 0 20px 0;
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.chart-wrapper {
  width: 100%;
  overflow-x: auto;
}

.chart-svg {
  width: 100%;
  height: auto;
  min-width: 400px;
}

.data-points circle {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-points circle:hover {
  r: 7;
}
</style>
