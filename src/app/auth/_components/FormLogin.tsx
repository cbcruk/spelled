'use client'

import { FormProps } from './Form.types'
import { FormSubmit } from './FormSubmit'

export function FormLogin({ onSubmitAction }: FormProps) {
  return (
    <form action={onSubmitAction}>
      <FormSubmit>로그인</FormSubmit>
    </form>
  )
}
