import { userAuthApiUrl } from './utils'

export async function apiCheckEmail(email: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/check-email'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiSendEmailCode(email: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/send-code'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiVerifyEmailCode(email: string, code: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/verify-code'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiVerifyMobileCode(phone: string, code: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/verify-phone-code'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiResendMobileCode(phone: string, email: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/resend-phone-code'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, email }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiCreateAccount(
  email: string,
  fullName: string,
  phone: string,
  password: string,
) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/register'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, fullName, password, phone }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiLogin(email: string, password: string) {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiLogout() {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return res.json()
  } catch {
    return null
  }
}

export async function apiGetProfile() {
  try {
    const res = await fetch(userAuthApiUrl('/api/auth/profile'), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return res.json()
  } catch {
    return null
  }
}
