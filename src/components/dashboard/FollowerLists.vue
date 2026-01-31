<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  newFollowers: string[]
  lostFollowers: string[]
  lostCount: number
  gainedCount: number
}>()

const ITEMS_PER_PAGE = 50
const limitNew = ref(ITEMS_PER_PAGE)
const limitLost = ref(ITEMS_PER_PAGE)

const displayedNew = computed(() => props.newFollowers.slice(0, limitNew.value))
const displayedLost = computed(() => props.lostFollowers.slice(0, limitLost.value))

const loadMoreNew = () => limitNew.value += ITEMS_PER_PAGE
const loadMoreLost = () => limitLost.value += ITEMS_PER_PAGE
</script>

<template>
  <div>
    <div v-if="gainedCount === 0 && lostCount === 0" class="info-box clean-box fade-in">
      <h3>😴 Todo tranquilo</h3>
      <p>No hay cambios respecto a tu último análisis.</p>
    </div>

    <div class="lists-container">
      <div v-if="lostFollowers.length > 0" class="list-column">
        <h3 class="list-title text-red">
          📉 Han dejado de seguirte <span class="count-badge">{{ lostCount }}</span>
        </h3>
        <ul class="user-list">
          <li v-for="user in displayedLost" :key="user" class="user-item">
            <span class="username">@{{ user }}</span>
            <a :href="`https://www.instagram.com/${user}`" target="_blank" class="btn-action btn-red">Ver</a>
          </li>
        </ul>
        <div v-if="lostFollowers.length > limitLost" class="load-more-container">
          <button @click="loadMoreLost" class="btn-load-more">Ver más ({{ lostFollowers.length - limitLost }})</button>
        </div>
      </div>

      <div v-if="newFollowers.length > 0" class="list-column">
        <h3 class="list-title text-green">
          ✨ Nuevos seguidores <span class="count-badge">{{ gainedCount }}</span>
        </h3>
        <ul class="user-list">
          <li v-for="user in displayedNew" :key="user" class="user-item">
            <span class="username">@{{ user }}</span>
            <a :href="`https://instagram.com/${user}`" target="_blank" class="btn-action btn-green">Ver</a>
          </li>
        </ul>
        <div v-if="newFollowers.length > limitNew" class="load-more-container">
          <button @click="loadMoreNew" class="btn-load-more">Ver más ({{ newFollowers.length - limitNew }})</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-box {
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.clean-box {
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  border: 1px solid #c5e1a5;
  color: #33691e;
}

.lists-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.list-column {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid white;
}

.list-title {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f5f9;
}

.user-list {
  list-style: none;
  padding: 0;
  max-height: 350px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8fafc;
}

.username {
  font-weight: 600;
  color: #334155;
}

.btn-action {
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-red {
  color: #ef4444;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.btn-red:hover {
  background: #ef4444;
  color: white;
}

.btn-green {
  color: #10b981;
  border: 1px solid #a7f3d0;
  background: #ecfdf5;
}

.btn-green:hover {
  background: #10b981;
  color: white;
}

.text-red {
  color: #ef4444;
}

.text-green {
  color: #10b981;
}

.count-badge {
  font-size: 0.8em;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 10px;
  color: #64748b;
  margin-left: 8px;
}

.load-more-container {
  padding-top: 10px;
  text-align: center;
}

.btn-load-more {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  width: 100%;
}

.btn-load-more:hover {
  background: #f8fafc;
  color: #334155;
  border-color: #cbd5e1;
}

@media (max-width: 600px) {
  .lists-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .list-column {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
  }

  .user-item {
    gap: 10px;
  }

  .username {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
}
</style>
