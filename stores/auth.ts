import type {
  LoginInput,
  User
} from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return user.value !== null
  })

  async function fetchUser() {
    try {
      user.value = await $fetch<User>(
        '/api/auth/me'
      )
    } catch {
      user.value = null
    }
  }

  async function login(data: LoginInput) {
    pending.value = true
    error.value = null

    try {
      user.value = await $fetch<User>(
        '/api/auth/login',
        {
          method: 'POST',
          body: data
        }
      )

      return true
    } catch (err) {
      console.error(err)

      user.value = null
      error.value = 'Invalid email or password'

      return false
    } finally {
      pending.value = false
    }
  }
  async function logout() {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
  } finally {
    user.value = null
    error.value = null
  }
}
  return {
    user,
    pending,
    error,
    isAuthenticated,
    fetchUser,
    login,
    logout
  }
})