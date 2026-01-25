import { ref } from 'vue'

export function useLoadingMessages() {
  const loadingText = ref('Analizando...')
  let loadingInterval: number | null = null
  let startTimeout: number | null = null

  const processingMessages = [
    '📂 Descomprimiendo ZIP...',
    '🔍 Leyendo seguidores...',
    '🧮 Comparando listas...',
    '☕ Esto puede tardar...',
    '🧐 Buscando cambios...',
    '🚀 ¡Ya casi está!',
    '✨ Finalizando...',
  ]

  const startLoadingMessages = () => {
    loadingText.value = 'Analizando...'

    startTimeout = setTimeout(() => {
      let index = 0
      loadingText.value = processingMessages[0] || 'Procesando...'

      loadingInterval = setInterval(() => {
        index++
        if (index >= processingMessages.length) {
          index = processingMessages.length - 1
        }
        loadingText.value = processingMessages[index] || 'Procesando...'
      }, 4000)
    }, 2000)
  }

  const stopLoadingMessages = () => {
    if (startTimeout) {
      clearTimeout(startTimeout)
      startTimeout = null
    }
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = null
    }
    loadingText.value = 'Analizando...'
  }

  return {
    loadingText,
    startLoadingMessages,
    stopLoadingMessages,
  }
}
