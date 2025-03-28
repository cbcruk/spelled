import { Schema } from 'effect'

export const CorrectionSchema = Schema.Struct({
  wrong: Schema.String,
  correct: Schema.String,
  explanation: Schema.String,
  difficulty: Schema.String,
})

export type Correction = Schema.Schema.Type<typeof CorrectionSchema>

export const SpelledSchema = Schema.Struct({
  id: Schema.Number,
  input: Schema.String,
  corrected: Schema.String,
  score: Schema.Number,
  corrections: Schema.parseJson(Schema.Array(CorrectionSchema)),
})

export const decodeSpelled = Schema.decodeUnknown(SpelledSchema)

export type Spelled = Schema.Schema.Type<typeof SpelledSchema>

export const UserSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  email: Schema.String,
  image: Schema.String,
  created: Schema.String,
  updated: Schema.String,
})

export const decodeUser = Schema.decodeUnknown(UserSchema)
export const decodeUserId = Schema.decodeUnknown(UserSchema.pick('id'))
