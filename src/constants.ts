export class Difficulty {
  static emoji = {
    easy: '🌱',
    medium: '🌿',
    hard: '🌲',
  }

  static hangul = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  }

  static toEmoji(key: string) {
    return this.emoji[key as keyof typeof Difficulty.emoji]
  }

  static toHangul(key: string) {
    return this.hangul[key as keyof typeof Difficulty.hangul]
  }
}
