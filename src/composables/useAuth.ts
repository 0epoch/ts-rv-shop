import { ref } from 'vue'

export default function useAuth() {
  const visible = ref(false)

  return {
    visible,
  }
}
