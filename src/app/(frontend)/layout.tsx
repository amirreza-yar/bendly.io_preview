import { ThemeProvider } from "@/components/theme-provider";
// import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import PWARegister from "@/components/pwa-register";
import { InstallPrompt, PushNotificationManager } from "@/components/pwa-main";

export const metadata = {
  title: "Bendly",
  description: "Flashing design app",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bendly",
  },
};

// const robot_flex = Roboto_Flex({
//   subsets: ["latin"],
// });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${robot_flex.className}`}> */}
      <body>
        <PWARegister />
        <PushNotificationManager />
        <InstallPrompt />
        <Toaster />
        {/* <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          > */}
        <main
          className="h-screen relative w-screen overflow-auto no-scrollbar font-roboto mx-auto"
          suppressHydrationWarning
        >
          {children}
        </main>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
