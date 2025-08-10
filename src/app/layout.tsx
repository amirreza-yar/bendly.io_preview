import { ThemeProvider } from '@/components/theme-provider'
import { Roboto_Flex } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { UserData, UserProvider } from '@/providers/main_providers/UserContext'
import { DBProvider } from '@/providers/db_providers/DBContext'

export const metadata = {
  title: 'Flashing Factory DEV',
  description: 'A PWA for Flashing DEV',
}

const robot_flex = Roboto_Flex({
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData: Partial<UserData> = {
    userId: '12ab34',
    fullname: 'Jon Doe',
    mobile: 9876543210,
    email: 'demo@domain.com',
    password: '12345678@Pass',
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ width: '100vw', height: '100%' }} className={robot_flex.className}>
        <UserProvider initialData={initialData}>
          <Toaster
            position="bottom-center"
            mobileOffset={{ bottom: '96px', right: '0', left: '0' }}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  'bg-[#171717] -fit px-6 py-[12.5px] rounded-md max-w-fit mx-auto shadow-md h-12',
                title: 'font-roboto text-xs/[22.5px] text-white',
              },
            }}
            duration={2000}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <DBProvider>
              <main className="h-screen relative w-screen overflow-auto no-scrollbar">
                {children}
              </main>
            </DBProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
