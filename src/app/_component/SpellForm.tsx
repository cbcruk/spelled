'use client'

import { SpellFormCheck } from './SpellFormCheck'
import { SpellFormSave } from './SpellFormSave'

export function SpellForm() {
  return (
    <SpellFormCheck>
      {(props) => <SpellFormSave key={props.data?.input} data={props.data} />}
    </SpellFormCheck>
  )
}
