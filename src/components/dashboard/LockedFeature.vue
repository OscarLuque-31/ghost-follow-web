<script setup lang="ts">
defineProps<{
  title: string
  description: string
  features: string[]
}>()

const emit = defineEmits(['open-pricing'])
</script>

<template>
  <div class="locked-container fade-in">
    <div class="icon-bg">
      🔒
    </div>
    <h2 class="title">{{ title }}</h2>
    <p class="description">{{ description }}</p>

    <ul class="benefits-list">
      <li v-for="(feature, index) in features" :key="index">
        ✨ {{ feature }}
      </li>
    </ul>

    <button class="unlock-btn" @click="$emit('open-pricing')">
      Desbloquear esta función ⭐
    </button>
  </div>
</template>

<style scoped>
.locked-container {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-bg {
  width: 80px;
  height: 80px;
  background: #fdf2f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #fce7f3;
}

.title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.description {
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.5;
}

.benefits-list {
  text-align: left;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
  list-style: none;
}

.benefits-list li {
  margin-bottom: 0.8rem;
  color: #334155;
  font-weight: 500;
}

.benefits-list li:last-child {
  margin-bottom: 0;
}

.unlock-btn {
  background: linear-gradient(135deg, #e91e63 0%, #db2777 100%);
  color: white;
  padding: 14px 32px;
  border-radius: 50px;
  border: none;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
  transition: transform 0.2s;
}

.unlock-btn:hover {
  transform: translateY(-2px) scale(1.02);
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
