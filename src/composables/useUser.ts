// src/composables/useUser.ts
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

// --- TIPOS ---
export enum PlanType {
  FREE = 'FREE',
  PREMIUM_MONTHLY = 'PREMIUM_MONTHLY',
  PREMIUM_LIFETIME = 'PREMIUM_LIFETIME',
}

export interface Subscription {
  planType: PlanType
  status: string // 'ACTIVE', 'CANCELED', etc.
  startDate: string
  currentPeriodEnd: string
}

export interface User {
  instagramUserName: string
  email: string
  subscription: Subscription
}

// --- ESTADO GLOBAL ---
const user = ref<User | null>(null)
const loadingUser = ref(false)

export function useUser() {
  const router = useRouter()

  // Lógica Maestra: ¿Es Premium?
  const isPremium = computed(() => {
    if (!user.value) return false
    const plan = user.value.subscription.planType
    const status = user.value.subscription.status

    // Es premium si NO es FREE y el estado es ACTIVO
    return plan !== PlanType.FREE && status === 'ACTIVE'
  })

  // Cargar usuario
  const fetchUser = async () => {
    loadingUser.value = true
    try {
      const { data } = await api.get<User>('/auth/me')
      user.value = data
    } catch (error) {
      console.error(error)
      logout()
    } finally {
      loadingUser.value = false
    }
  }

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('jwt_token')
    user.value = null
    router.push('/login')
  }

  return {
    user,
    loadingUser,
    isPremium,
    fetchUser,
    logout,
  }
}
