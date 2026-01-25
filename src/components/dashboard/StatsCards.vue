<script setup lang="ts">
import type { Stats } from '@/composables/useFollowerAnalysis'
defineProps<{ stats: Stats }>()
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Total Seguidores</h3>
      <span class="number">{{ stats.totalFollowers }}</span>
    </div>
    <div class="stat-card green-card">
      <h3>Nuevos</h3>
      <span class="number">+{{ stats.gainedCount }}</span>
    </div>
    <div class="stat-card red-card">
      <h3>Han dejado de seguirte</h3>
      <span class="number">-{{ stats.lostCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f8fafc;
}

.stat-card h3 {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card .number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2c3e50;
}

.red-card .number {
  color: #ef4444;
}

.green-card .number {
  color: #10b981;
}

@media (max-width: 600px) {
  .stat-card .number {
    font-size: 1.8rem;
  }
}
</style>
