import { UnknownError } from '@/errors'
import { checkSpellingWithScore } from '@/lib/open-ai'
import { Spelled } from '@/types'

export type CheckSpellingStateData = Spelled | null

export async function checkSpelling(
  _prevState: {
    data: CheckSpellingStateData
    error: Error | null
  },
  formData: FormData
) {
  try {
    const data = await checkSpellingWithScore(formData.get('input') as string)

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new UnknownError(),
    }
  }
}
