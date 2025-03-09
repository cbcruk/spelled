import { signIn } from '@/auth'

export default function Login() {
  return (
    <form
      action={async () => {
        'use server'

        await signIn('github')
      }}
    >
      <button type="submit">로그인</button>
    </form>
  )
}
