import { FormProps } from './Form.types'
import { FormSubmit } from './FormSubmit'

export function FormLogout({ onSubmitAction }: FormProps) {
  return (
    <form action={onSubmitAction}>
      <FormSubmit>로그아웃</FormSubmit>
    </form>
  )
}
