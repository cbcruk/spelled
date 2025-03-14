import { signOut } from '@/auth'

export default function Logout() {
  return (
    <form
      action={async () => {
        'use server'

        await signOut()
      }}
    >
      <button type="submit">로그아웃</button>
    </form>
  )
}
