<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';

interface Stats {
  totalFollowers: number;
  gainedCount: number;
  lostCount: number;
}

interface AnalysisResult {
  stats: Stats;
  newFollowers: string[];
  lostFollowers: string[];
}

const file = ref<File | null>(null);
const message = ref('');
const messageType = ref<'success' | 'error' | ''>('');
const isLoading = ref(false);
const isDragging = ref(false);
const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const currentAccountName = ref('');
const analysisResults = ref<AnalysisResult | null>(null);
const showResults = ref(false);

onMounted(async () => {
  try {
    const response = await api.get('/auth/me');
    currentAccountName.value = response.data;
  } catch (error) {
    console.error(error);
    localStorage.removeItem('jwt_token');
    router.push('/login');
  }
});

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];

  if (selectedFile) {
    processFile(selectedFile);
  }
  target.value = '';
};

const onDragOver = (e: DragEvent) => { e.preventDefault(); isDragging.value = true; };
const onDragLeave = (e: DragEvent) => { e.preventDefault(); isDragging.value = false; };

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  const droppedFile = e.dataTransfer?.files?.[0];

  if (droppedFile) {
    processFile(droppedFile);
  }
};

const processFile = (selectedFile: File) => {
  if (!selectedFile.name.endsWith('.json')) {
    message.value = '⚠️ Por favor, sube un archivo .json válido';
    messageType.value = 'error';
    return;
  }
  file.value = selectedFile;
  message.value = '';
  messageType.value = '';
};

const removeFile = () => {
  file.value = null;
  message.value = '';
};

const uploadData = async () => {
  if (!file.value) return;

  if (!currentAccountName.value) {
    message.value = '⚠️ Error identificando tu cuenta. Recarga la página.';
    messageType.value = 'error';
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    const fileContent = await file.value.text();
    let jsonData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (e) {
      throw new Error("El archivo no es un JSON válido.");
    }

    if (!Array.isArray(jsonData)) {
      throw new Error("El formato del JSON es incorrecto (debe ser una lista []).");
    }

    const response = await api.post('/followers/upload', jsonData, {
      params: {
        accountName: currentAccountName.value
      }
    });

    analysisResults.value = response.data;
    showResults.value = true;

    file.value = null;
    message.value = '';

  } catch (error: any) {
    message.value = error.message || '❌ Error al procesar los datos.';
    messageType.value = 'error';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('jwt_token');
  router.push('/login');
};
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="brand">
        <div class="logo-icon">👻</div>
        <span class="brand-name mobile-hide">GhostFollow</span>
      </div>
      <div class="user-actions">
        <span class="user-badge">{{ currentAccountName || 'Cargando...' }}</span>

        <button @click="logout" class="btn-icon-logout" title="Cerrar Sesión">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </nav>

    <main class="main-content">

      <div v-if="!showResults" class="card-upload fade-in">
        <div class="card-header">
          <h2>Analizador</h2>
          <p>Sube tu historial para analizar <strong>{{ currentAccountName }}</strong>.</p>
        </div>

        <div class="upload-area">
          <div v-if="!file" class="drop-zone" :class="{ 'active': isDragging }" @dragover="onDragOver"
            @dragleave="onDragLeave" @drop="onDrop" @click="triggerFileInput">

            <input type="file" ref="fileInput" class="hidden-input" accept=".json" @change="handleFileSelect" />

            <div class="icon-cloud">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p class="drop-text">Arrastra tu archivo <span>followers_1.json</span> aquí</p>
            <span class="browse-btn">o haz clic para buscar</span>
          </div>

          <div v-else class="file-preview">
            <div class="file-info">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
            <button @click="removeFile" class="btn-remove" title="Quitar archivo">✕</button>
          </div>
        </div>

        <button @click="uploadData" class="btn-primary" :disabled="!file || isLoading"
          :class="{ 'loading': isLoading }">
          <span v-if="!isLoading">Analizar Ahora</span>
          <span v-else class="loader"></span>
        </button>

        <transition name="fade">
          <div v-if="message" class="status-message" :class="messageType">
            {{ message }}
          </div>
        </transition>
      </div>

      <div v-else class="results-dashboard fade-in">

        <button @click="showResults = false" class="btn-back">
          ← Analizar otro archivo
        </button>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Seguidores</h3>
            <span class="number">{{ analysisResults?.stats.totalFollowers }}</span>
          </div>

          <div class="stat-card green-card">
            <h3>Nuevos</h3>
            <span class="number">+{{ analysisResults?.stats.gainedCount }}</span>
          </div>

          <div class="stat-card red-card">
            <h3>Han dejado de seguirte</h3>
            <span class="number">-{{ analysisResults?.stats.lostCount }}</span>
          </div>
        </div>

        <div v-if="analysisResults?.stats.gainedCount === 0 && analysisResults?.stats.lostCount === 0" class="info-box">
          <p>👋 <strong>¡Primera vez por aquí!</strong><br>
            Hemos guardado tu lista base. Vuelve a subir el archivo en unos días para ver quién te ha dejado de seguir.
          </p>
        </div>

        <div class="lists-container">

          <div v-if="analysisResults?.lostFollowers && analysisResults?.lostFollowers.length > 0" class="list-column">
            <h3 class="list-title text-red">📉 Han dejado de seguirte</h3>
            <ul class="user-list">
              <li v-for="user in analysisResults?.lostFollowers" :key="user" class="user-item">
                <span class="username">@{{ user }}</span>
                <a :href="`https://instagram.com/${user}`" target="_blank" class="btn-action btn-red">Ver</a>
              </li>
            </ul>
          </div>

          <div v-if="analysisResults?.newFollowers && analysisResults?.newFollowers.length > 0" class="list-column">
            <h3 class="list-title text-green">✨ Nuevos seguidores</h3>
            <ul class="user-list">
              <li v-for="user in analysisResults?.newFollowers" :key="user" class="user-item">
                <span class="username">@{{ user }}</span>
                <a :href="`https://instagram.com/${user}`" target="_blank" class="btn-action btn-green">Ver</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: #e91e63;
  --primary-hover: #c2185b;
  --bg-color: #f8f9fa;
  --surface: #ffffff;
  --text-main: #2c3e50;
  --text-muted: #64748b;
  --border: #e2e8f0;
}

.dashboard-container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #fdf2f8;
  background-image: radial-gradient(at 0% 0%, hsla(334, 97%, 92%, 1) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(265, 100%, 93%, 1) 0, transparent 50%);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(233, 30, 99, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 1.8rem;
  background: #fff;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(233, 30, 99, 0.1);
}

.brand-name {
  font-weight: 800;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  font-size: 0.9rem;
  font-weight: 600;
  color: #880e4f;
  background: #fce4ec;
  padding: 6px 12px;
  border-radius: 20px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}

.btn-icon-logout {
  background: white;
  border: 1px solid #fecdd3;
  color: #e91e63;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-logout:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-2px);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card-upload {
  background: white;
  width: 100%;
  max-width: 550px;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01);
  text-align: center;
  border: 1px solid white;
}

.card-header h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #1a202c;
  font-weight: 700;
}

.card-header p {
  color: #64748b;
  margin-bottom: 2rem;
}

.upload-area {
  margin-bottom: 2rem;
}

.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 3rem 1.5rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.drop-zone:hover,
.drop-zone.active {
  border-color: #e91e63;
  background: #fdf2f8;
  transform: scale(1.01);
}

.icon-cloud {
  color: #94a3b8;
  transition: color 0.3s;
}

.drop-zone:hover .icon-cloud {
  color: #e91e63;
}

.drop-text {
  font-weight: 500;
  color: #475569;
}

.drop-text span {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.browse-btn {
  color: #e91e63;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hidden-input {
  display: none;
}

.file-preview {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 1.5rem;
}

.file-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
  word-break: break-all;
}

.file-size {
  font-size: 0.75rem;
  color: #94a3b8;
}

.btn-remove {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e91e63 0%, #d81b60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(233, 30, 99, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.status-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.results-dashboard {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.btn-back {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
  margin-bottom: -1rem;
  font-size: 0.95rem;
}

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

.info-box {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.5;
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

.text-red {
  color: #ef4444;
}

.text-green {
  color: #10b981;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .card-upload {
    padding: 1.5rem;
  }

  .navbar {
    padding: 0.8rem 1rem;
  }

  .brand-name {
    display: none;
  }

  .logo-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .user-badge {
    max-width: 120px;
    font-size: 0.8rem;
    padding: 4px 10px;
  }

  .user-actions {
    gap: 0.5rem;
  }

  .lists-container {
    grid-template-columns: 1fr;
  }

  .stat-card .number {
    font-size: 1.8rem;
  }
}
</style>
