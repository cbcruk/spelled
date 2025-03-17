import { auth, signIn, signOut } from '@/auth'
import { FormLogout } from './_components/FormLogout'
import { FormLogin } from './_components/FormLogin'

async function AuthPage() {
  const session = await auth()

  switch (session) {
    case null:
      return (
        <FormLogin
          onSubmitAction={async () => {
            'use server'

            await signIn('github')
          }}
        />
      )
    default:
      return (
        <FormLogout
          onSubmitAction={async () => {
            'use server'

            await signOut()
          }}
        />
      )
  }
}

export default AuthPage
