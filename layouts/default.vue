<script setup lang="ts">
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          S
        </div>

        <div>
          <strong class="brand">Store Admin</strong>
          <span class="brand-subtitle">Management</span>
        </div>
      </div>

      <nav class="navigation">
        <NuxtLink
          to="/dashboard"
          class="nav-link"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="nav-link"
        >
          Products
        </NuxtLink>

        <NuxtLink
          to="/orders"
          class="nav-link"
        >
          Orders
        </NuxtLink>

        <NuxtLink
        v-if="authStore.user?.role === 'ADMIN'"
        to="/users"
        class="nav-link"
      >
        Users
      </NuxtLink>
      </nav>

      <div class="sidebar-footer">
  <div class="user-info">
    <div class="user-avatar">
      {{ authStore.user?.name?.charAt(0).toUpperCase() ?? 'U' }}
    </div>

    <div class="user-details">
      <strong>
        {{ authStore.user?.name }}
      </strong>

      <span>
        {{ authStore.user?.role }}
      </span>
    </div>
  </div>

  <button
    class="logout-button"
    @click="logout"
  >
    Logout
  </button>
</div>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  margin: 0;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  background: #f6f7f9;
  color: #1f2937;
}

button,
input {
  font: inherit;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;

  width: 250px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  padding: 24px 18px;

  background: #111827;
  color: white;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 40px;
}

.logo {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: white;
  color: #111827;

  font-weight: 700;
  font-size: 20px;
}

.brand {
  display: block;
  font-size: 16px;
}

.brand-subtitle {
  display: block;
  margin-top: 3px;

  color: #9ca3af;
  font-size: 12px;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-link {
  padding: 11px 14px;

  border-radius: 8px;

  color: #d1d5db;
  text-decoration: none;

  transition:
    background 0.2s,
    color 0.2s;
}

.nav-link:hover {
  background: #1f2937;
  color: white;
}

.nav-link.router-link-active {
  background: #374151;
  color: white;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;

  border-top: 1px solid #374151;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details strong,
.user-details span {
  display: block;
}

.user-details span {
  margin-top: 3px;

  color: #9ca3af;
  font-size: 12px;
}

.logout-button {
  width: 100%;

  margin-top: 14px;
  padding: 9px 12px;

  border: 1px solid #374151;
  border-radius: 8px;

  background: transparent;
  color: #d1d5db;

  cursor: pointer;
}

.logout-button:hover {
  background: #1f2937;
  color: white;
}

.sidebar-footer strong,
.sidebar-footer span {
  display: block;
}

.sidebar-footer span {
  margin-top: 3px;

  color: #9ca3af;
  font-size: 12px;
}

.user-avatar {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #374151;

  font-size: 13px;
  font-weight: 600;
}

.content {
  width: calc(100% - 250px);

  margin-left: 250px;
  padding: 40px;

  min-height: 100vh;
}

@media (max-width: 800px) {
  .sidebar {
    width: 190px;
  }

  .content {
    width: calc(100% - 190px);
    margin-left: 190px;
    padding: 24px;
  }
}
</style>