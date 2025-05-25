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
})

const SpelledSchemaFromOpenAI = Schema.Struct({
  ...SpelledSchema.fields,
  corrections: Schema.Array(CorrectionSchema),
})

const SpelledSchemaFromDB = Schema.Struct({
  ...SpelledSchema.fields,
  corrections: Schema.parseJson(Schema.Array(CorrectionSchema)),
})

export const SpelledWithoutId = SpelledSchemaFromOpenAI.omit('id')

export const decodeSpelled = Schema.decodeUnknown(SpelledSchemaFromOpenAI)
export const decodeSpelledWithoutId = Schema.decodeUnknown(SpelledWithoutId)

export const decodeSpelledArray = Schema.decodeUnknown(
  Schema.Array(SpelledSchemaFromDB)
)

export type Spelled = Schema.Schema.Type<typeof SpelledSchemaFromOpenAI>
export type SpelledWithoutId = Schema.Schema.Type<typeof SpelledWithoutId>

export const UserSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  email: Schema.String,
  image: Schema.NullOr(Schema.String),
  created: Schema.String,
  updated: Schema.String,
})

export type User = Schema.Schema.Type<typeof UserSchema>
export type UserEmail = User['email']

export const decodeUser = Schema.decodeUnknown(UserSchema)
export const decodeSignInUser = Schema.decodeUnknown(
  UserSchema.omit('created', 'updated')
)
