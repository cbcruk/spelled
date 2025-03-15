export interface Spelled {
  id: string
  input: string
  corrected: string
  score: number
  corrections: Correction[]
}

export interface Correction {
  wrong: string
  correct: string
  explanation: string
  difficulty: string
}
