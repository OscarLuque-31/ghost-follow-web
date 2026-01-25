import { ref } from 'vue'

export function useFileUpload() {
  const file = ref<File | null>(null)
  const message = ref('')
  const messageType = ref<'success' | 'error' | ''>('')
  const isDragging = ref(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processFile = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      message.value = '⚠️ Por favor, sube el archivo .zip que te envió Instagram'
      messageType.value = 'error'
      return
    }

    const MAX_SIZE_MB = 15
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      message.value = `⚠️ El archivo es demasiado grande (${formatFileSize(selectedFile.size)}).
      Parece que has descargado fotos/vídeos. Selecciona SOLO "Seguidores y seguidos".`
      messageType.value = 'error'
      return
    }

    file.value = selectedFile
    message.value = ''
    messageType.value = ''
  }

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile) processFile(selectedFile)
    target.value = ''
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
  }
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false
    const droppedFile = e.dataTransfer?.files?.[0]
    if (droppedFile) processFile(droppedFile)
  }

  const removeFile = () => {
    file.value = null
    message.value = ''
  }

  return {
    file,
    message,
    messageType,
    isDragging,
    formatFileSize,
    handleFileSelect,
    onDragOver,
    onDragLeave,
    onDrop,
    removeFile,
  }
}
