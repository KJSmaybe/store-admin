<script setup lang="ts">
import type {
  CreateUserInput,
  User,
  UserRole
} from '~/types/user'

const authStore = useAuthStore()
const usersStore = useUsersStore()

if (authStore.user?.role !== 'ADMIN') {
  await navigateTo('/dashboard')
}

await usersStore.fetchUsers()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<UserRole>('MANAGER')

const submitting = ref(false)
const formError = ref<string | null>(null)
const actionError = ref<string | null>(null)

async function createUser() {
  formError.value = null

  if (!name.value.trim()) {
    formError.value = 'Name is required'
    return
  }

  if (!email.value.trim()) {
    formError.value = 'Email is required'
    return
  }

  if (password.value.length < 8) {
    formError.value =
      'Password must contain at least 8 characters'

    return
  }

  const data: CreateUserInput = {
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
    role: role.value
  }

  submitting.value = true

  try {
    await usersStore.createUser(data)

    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'MANAGER'
  } catch (error) {
    console.error(error)

    formError.value =
      'Failed to create user'
  } finally {
    submitting.value = false
  }
}

async function changeRole(
  user: User,
  event: Event
) {
  const select = event.target as HTMLSelectElement
  const newRole = select.value as UserRole

  actionError.value = null

  try {
    await usersStore.updateUser(
      user.id,
      {
        role: newRole
      }
    )
  } catch (error) {
    console.error(error)

    actionError.value =
      'Failed to change user role'

    await usersStore.fetchUsers()
  }
}

async function toggleUserStatus(user: User) {
  actionError.value = null

  try {
    await usersStore.updateUser(
      user.id,
      {
        isActive: !user.isActive
      }
    )
  } catch (error) {
    console.error(error)

    actionError.value =
      'Failed to change user status'

    await usersStore.fetchUsers()
  }
}

function isCurrentUser(id: number) {
  return authStore.user?.id === id
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="users-page">
    <header class="page-header">
      <div>
        <h1>Users</h1>

        <p>
          Manage access to Store Admin.
        </p>
      </div>

      <div class="users-count">
        {{ usersStore.users.length }} users
      </div>
    </header>

    <form
      class="user-form"
      @submit.prevent="createUser"
    >
      <div class="form-header">
        <div>
          <h2>Add user</h2>

          <p>
            Create a new administrator or manager.
          </p>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label>Name</label>

          <input
            v-model="name"
            type="text"
            placeholder="John Smith"
          >
        </div>

        <div class="field">
          <label>Email</label>

          <input
            v-model="email"
            type="email"
            placeholder="john@store.local"
          >
        </div>

        <div class="field">
          <label>Password</label>

          <input
            v-model="password"
            type="password"
            placeholder="Minimum 8 characters"
          >
        </div>

        <div class="field">
          <label>Role</label>

          <select v-model="role">
            <option value="MANAGER">
              MANAGER
            </option>

            <option value="ADMIN">
              ADMIN
            </option>
          </select>
        </div>

        <button
          class="create-button"
          type="submit"
          :disabled="submitting"
        >
          {{
            submitting
              ? 'Creating...'
              : 'Add user'
          }}
        </button>
      </div>

      <p
        v-if="formError"
        class="error"
      >
        {{ formError }}
      </p>
    </form>

    <div class="section-header">
      <div>
        <h2>User list</h2>

        <span>
          Accounts with access to the admin panel
        </span>
      </div>
    </div>

    <p
      v-if="actionError"
      class="error action-error"
    >
      {{ actionError }}
    </p>

    <div
      v-if="usersStore.pending"
      class="message"
    >
      Loading users...
    </div>

    <div
      v-else-if="usersStore.error"
      class="message error"
    >
      {{ usersStore.error }}
    </div>

    <div
      v-else
      class="table-wrapper"
    >
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in usersStore.users"
            :key="user.id"
          >
            <td>
              <div class="user-cell">
                <div class="avatar">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>

                <div>
                  <strong>
                    {{ user.name }}
                  </strong>

                  <small
                    v-if="isCurrentUser(user.id)"
                  >
                    You
                  </small>
                </div>
              </div>
            </td>

            <td>
              {{ user.email }}
            </td>

            <td>
              <select
                class="role-select"
                :value="user.role"
                :disabled="isCurrentUser(user.id)"
                @change="changeRole(user, $event)"
              >
                <option value="ADMIN">
                  ADMIN
                </option>

                <option value="MANAGER">
                  MANAGER
                </option>
              </select>
            </td>

            <td>
              <span
                class="status"
                :class="{
                  active: user.isActive,
                  inactive: !user.isActive
                }"
              >
                {{
                  user.isActive
                    ? 'Active'
                    : 'Inactive'
                }}
              </span>
            </td>

            <td>
              {{ formatDate(user.createdAt) }}
            </td>

            <td>
              <button
                class="status-button"
                :class="{
                  deactivate: user.isActive,
                  activate: !user.isActive
                }"
                :disabled="isCurrentUser(user.id)"
                @click="toggleUserStatus(user)"
              >
                {{
                  user.isActive
                    ? 'Block'
                    : 'Activate'
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.users-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
}

.page-header p {
  margin: 7px 0 0;
  color: #6b7280;
}

.users-count {
  padding: 8px 12px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  color: #6b7280;
  font-size: 14px;
}

.user-form {
  padding: 22px;

  margin-bottom: 30px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.form-header {
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
  font-size: 18px;
}

.form-header p {
  margin: 5px 0 0;

  color: #6b7280;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns:
    1fr
    1.4fr
    1fr
    160px
    auto;

  align-items: end;
  gap: 14px;
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

.field input,
.field select {
  height: 42px;

  padding: 0 12px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: #4f46e5;

  box-shadow:
    0 0 0 3px rgba(79, 70, 229, 0.1);
}

.create-button {
  height: 42px;

  padding: 0 18px;

  border: none;
  border-radius: 8px;

  background: #4f46e5;
  color: white;

  font-weight: 600;
  cursor: pointer;
}

.create-button:hover {
  background: #4338ca;
}

.create-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
}

.section-header span {
  display: block;

  margin-top: 4px;

  color: #9ca3af;
  font-size: 13px;
}

.table-wrapper {
  overflow-x: auto;

  background: white;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 14px 18px;

  background: #f9fafb;

  color: #6b7280;

  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
}

td {
  padding: 17px 18px;

  border-top: 1px solid #e5e7eb;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-cell small {
  display: block;

  margin-top: 3px;

  color: #9ca3af;
}

.avatar {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: #f3f4f6;

  font-weight: 700;
}

.role-select {
  padding: 7px 9px;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  background: white;

  font-weight: 600;
}

.role-select:disabled {
  opacity: 0.55;
}

.status {
  display: inline-block;

  padding: 5px 9px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.active {
  background: #dcfce7;
  color: #166534;
}

.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-button {
  padding: 7px 11px;

  border: none;
  border-radius: 7px;

  cursor: pointer;

  font-weight: 600;
}

.deactivate {
  background: #fef2f2;
  color: #dc2626;
}

.activate {
  background: #dcfce7;
  color: #166534;
}

.status-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.message {
  padding: 30px;

  background: white;
  border-radius: 12px;

  text-align: center;
}

.error {
  margin-top: 14px;

  color: #dc2626;
  font-size: 13px;
}

.action-error {
  margin-bottom: 14px;
}

@media (max-width: 1100px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
}
</style>