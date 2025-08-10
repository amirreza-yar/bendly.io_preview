export function generateRandomId({ length = 6 }: { length?: number } = {}): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const len = Math.max(0, Math.floor(length))
  if (len === 0) return ''

  // browser and modern Node: use crypto.getRandomValues (Web Crypto)
  const array = new Uint8Array(len)
  // @ts-ignore - globalThis.crypto is available in modern browsers and Node >= 19
  const cryptoObj = typeof globalThis?.crypto !== 'undefined' ? globalThis.crypto : undefined

  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(array)
    let result = ''
    for (let i = 0; i < len; i++) {
      // map random byte to index in chars
      result += chars[array[i] % chars.length]
    }
    return result
  }

  // fallback to Math.random if crypto isn't available
  let fallback = ''
  for (let i = 0; i < len; i++) {
    fallback += chars[Math.floor(Math.random() * chars.length)]
  }
  return fallback
}

/**
 * Returns true if `id` matches the charset used by generateRandomId
 * and (optionally) has the specified length.
 *
 * Note: this is a pattern check / heuristic. It cannot *prove* the id
 * was produced by generateRandomId — only that it follows the same rules.
 */
export function looksLikeGeneratedId(
  id: unknown,
  { length = 6 }: { length?: number } = {},
): boolean {
  const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const ID_REGEX = new RegExp(`^[${ID_ALPHABET}]+$`)
  if (typeof id !== 'string') return false

  // Validate optional length param
  if (length !== undefined) {
    if (!Number.isInteger(length) || length < 0) return false
    if (length === 0) return id === '' // your generator returns '' for length 0
    return id.length === length && ID_REGEX.test(id)
  }

  // If no length provided, require at least one char (generator returns '' only for length 0)
  return id.length > 0 && ID_REGEX.test(id)
}
