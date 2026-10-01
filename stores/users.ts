import type {
  CreateUserInput,
  UpdateUserInput,
  User
} from '~/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    pending.value = true
    error.value = null

    try {
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined

      users.value = await $fetch<User[]>(
        '/api/users',
        {
          headers
        }
      )
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load users'
    } finally {
      pending.value = false
    }
  }

  async function createUser(
    data: CreateUserInput
  ) {
    const user = await $fetch<User>(
      '/api/users',
      {
        method: 'POST',
        body: data
      }
    )

    users.value.unshift(user)

    return user
  }

  async function updateUser(
    id: number,
    data: UpdateUserInput
  ) {
    const updatedUser = await $fetch<User>(
      `/api/users/${id}`,
      {
        method: 'PUT',
        body: data
      }
    )

    const index = users.value.findIndex(
      (user) => user.id === id
    )

    if (index !== -1) {
      users.value[index] = updatedUser
    }

    return updatedUser
  }

  return {
    users,
    pending,
    error,

    fetchUsers,
    createUser,
    updateUser
  }
})