<script setup lang="ts">
import { ref } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps<{
  isLoading: boolean
  loadingText: string
  parentMessage?: string
}>()

const emit = defineEmits(['upload', 'file-changed'])

const {
  file, message, messageType, isDragging, formatFileSize,
  handleFileSelect, onDragOver, onDragLeave, onDrop, removeFile
} = useFileUpload()

const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInput.value?.click()

const emitUpload = () => {
  if (file.value) {
    emit('upload', file.value)
  }
}
</script>

<template>
  <div class="card-upload fade-in">
    <div class="card-header">
      <h2>Analizador</h2>
      <p>Sube tu historial para analizar tu cuenta.</p>
    </div>

    <div class="upload-area">
      <div v-if="!file" class="drop-zone" :class="{ active: isDragging }" @dragover="onDragOver"
        @dragleave="onDragLeave" @drop="onDrop" @click="triggerFileInput">
        <input type="file" ref="fileInput" class="hidden-input" accept=".zip" @change="handleFileSelect" />

        <div class="icon-cloud">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <p class="drop-text">Arrastra el archivo <span>instagram_data.zip</span> aquí</p>
        <p style="font-size: 0.8em; color: #94a3b8; margin-top: 5px">(Tal cual te llegó al correo)</p>
        <span class="browse-btn">o clic para buscar</span>
      </div>

      <div v-else class="file-preview">
        <div class="file-info">
          <div class="file-icon">📦</div>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button @click="removeFile" class="btn-remove">✕</button>
      </div>
    </div>

    <button @click="emitUpload" class="btn-primary" :disabled="!file || isLoading" :class="{ loading: isLoading }">
      <span v-if="!isLoading">Analizar Ahora</span>
      <div v-else class="loading-content">
        <span class="loader"></span>
        <span class="loading-text">{{ loadingText }}</span>
      </div>
    </button>

    <transition name="fade">
      <div v-if="message || parentMessage" class="status-message" :class="messageType || 'error'">
        {{ message || parentMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.card-upload {
  background: white;
  width: 100%;
  max-width: 550px;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
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
  margin-top: 20px;
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

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.loading-text {
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  animation: fadeIn 0.5s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
  flex-shrink: 0;
}

.status-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .card-upload {
    padding: 1.5rem;
  }

  .loading-text {
    font-size: 0.8rem;
  }
}
</style>
