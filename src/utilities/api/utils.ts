export function userAuthApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_USER_AUTH_API || ''
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
