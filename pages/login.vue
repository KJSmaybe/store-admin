<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function submitLogin() {
  const success = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    await navigateTo('/dashboard')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">
        S
      </div>

      <h1>Store Admin</h1>

      <p class="subtitle">
        Sign in to your account
      </p>

      <form @submit.prevent="submitLogin">
        <div class="field">
          <label>Email</label>

          <input
            v-model="email"
            type="email"
            placeholder="admin@store.local"
            autocomplete="email"
          >
        </div>

        <div class="field">
          <label>Password</label>

          <input
            v-model="password"
            type="password"
            placeholder="Your password"
            autocomplete="current-password"
          >
        </div>

        <p
          v-if="authStore.error"
          class="error"
        >
          {{ authStore.error }}
        </p>

        <button
          type="submit"
          :disabled="authStore.pending"
        >
          {{
            authStore.pending
              ? 'Signing in...'
              : 'Sign in'
          }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: #f3f4f6;
}

.login-card {
  width: 100%;
  max-width: 420px;

  padding: 36px;

  background: white;

  border: 1px solid #e5e7eb;
  border-radius: 16px;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.05);
}

.logo {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 12px;

  background: #111827;
  color: white;

  font-size: 22px;
  font-weight: 700;
}

h1 {
  margin: 0;

  text-align: center;
  font-size: 28px;
}

.subtitle {
  margin: 8px 0 28px;

  color: #6b7280;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.field input {
  height: 44px;

  padding: 0 12px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  outline: none;
}

.field input:focus {
  border-color: #4f46e5;

  box-shadow:
    0 0 0 3px rgba(79, 70, 229, 0.1);
}

button {
  height: 44px;

  border: none;
  border-radius: 8px;

  background: #4f46e5;
  color: white;

  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin: 0;

  color: #dc2626;
  font-size: 13px;
}
</style>