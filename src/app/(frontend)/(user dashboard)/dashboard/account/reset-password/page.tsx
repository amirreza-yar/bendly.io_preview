import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { ArrowLeft, Pencil } from '@/components/uikit/icons'
import Link from 'next/link'
import { Button } from '@/components/uikit/buttons/button'
import { ResetPasswordIcon, ChevronRight } from '@/components/uikit/icons'

export default function ResetPasswordPage() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white">
        <div className={'flex items-center justify-between h-full w-full px-4 relative'}>
          <Link href={''} className="absolute">
            <ArrowLeft />
          </Link>
          <div className="w-full flex ml-12 ">
            <h6 className="">Reset Password</h6>
          </div>
        </div>
      </header>
      <ContentWrapper className="">
        <div className="grid text-center">
          <div className="grid px-6 gap-2 pt-12">
            <h5>Reset your password</h5>
            <p className="subtitle-regular">We will send a reset link to your email address</p>
            <div className="w-full flex items-center justify-center mt-4">
              <Link
                href=""
                className="flex w-fit items-center justify-center gap-2 px-4 py-2 border border-border-default rounded-full"
              >
                <p className="subtitle-large">demo@domain.com</p>
                <Pencil className="size-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 mb-16">
          <Link href="/dashboard/account">
            <Button type="submit" className="w-full bg-primary">
              Send Reset Link
            </Button>
          </Link>

          <Link
            href="/dashboard/account"
            className="w-full flex items-center justify-center pt-6  gap-2"
          >
            <p className="text-caption-regular">Remembered your password?</p>
            <ResetPasswordIcon className="size-[15px] text-primary" />
            <p className="label-regular text-primary">Back to Login</p>
            <ChevronRight className="size-5 text-primary" />
          </Link>
        </div>
      </ContentWrapper>
    </>
  )
}
