export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.fetchUser()
  }

  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    }

    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})