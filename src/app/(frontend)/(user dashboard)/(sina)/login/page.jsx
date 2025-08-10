'use client'
import { Button } from '@/components/uikit/buttons/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleIcon ,  ArrowLeft } from '@/components/ui/icon'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login, getGoogleLoginUrl } from './actions'
import { useRouter } from 'next/navigation'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import {LabeledInput} from '@/components/uikit/input'
import {EyeIcon} from '@/components/uikit/icons'

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const onSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailTouched(true);
      return;
    }
    setLoading(true);
    // Simulate email check
    setTimeout(() => {
      setLoading(false);
      setEmailConfirmed(true);
    }, 500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate password check and login
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard'); // or wherever
    }, 500);
  };

  const handleGoogleLogin = async () => {
    const { url } = await getGoogleLoginUrl();
    router.push('/verify-email');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col w-full h-full mx-auto bg-white shadow-md p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-none sm:rounded-lg">
        <div className="flex items-center mb-6 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center mr-5.5">
            <h6 className="text-sm md:text-md font-bold">Logo</h6>
          </div>
        </div>

        <div className="text-center mb-10 pt-5.5">
          {!emailConfirmed ? (
            <>
              <h1 className="text-lg md:text-xl font-bold">Welcome to Flashing Factory</h1>
              <p className="text-gray-600 text-xs md:text-sm">please log in to your account</p>
            </>
          ) : (
            <>
              <h1 className="text-lg md:text-xl font-bold">Welcome back!</h1>
              <p className="text-gray-600 text-xs md:text-sm">Enter your password to login</p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          {!emailConfirmed && (
            <>
              <Button variant="outline" className="my-2 text-sm h-11 border-gray-300 bg-white [&_svg]:size-5 w-full" onClick={handleGoogleLogin}>
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-700 text-2xs-m">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-6 flex-grow w-full">
                <div>
                  <LabeledInput
                    label="Email"
                    type="text"
                    placeholder="you@example.com"
                    className=""
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (!emailTouched) setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    helpText={
                      email.length > 0 && !isValidEmail(email) && emailTouched
                        ? "Please enter a valid email address."
                        : ""
                    }
                    error={email.length > 0 && !isValidEmail(email) && emailTouched}
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="h-[44px] w-full bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Continue'}
                </Button>
              </form>
            </>
          )}

          {emailConfirmed && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 flex-grow w-full h-[258px]">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Email</Label>
                  <button
                    type="button"
                    className="text-xs text-blue-500 font-medium"
                    onClick={() => setEmailConfirmed(false)}
                  >
                    Not you? Change email
                  </button>
                </div>
                <input
                  type="text"
                  value={email}
                  readOnly
                  disabled
                  className="w-full mt-1 h-11 rounded-lg border border-gray-300 bg-gray-100 px-4 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <div className="mb-6">
                <Label className="text-xs text-gray-600">Password</Label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your Password"
                    className="w-full mt-1 h-11 rounded-lg border border-gray-300 pr-10 pl-4 text-gray-900 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-xs text-blue-500 font-medium"
                    onClick={() => alert('Forgot Password?')}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                variant="default"
                className="h-[44px] w-full bg-blue-500 text-white hover:bg-blue-700"
                disabled={loading || !password}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
   