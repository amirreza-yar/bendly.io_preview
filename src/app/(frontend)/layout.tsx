import { ThemeProvider } from "@/components/theme-provider";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/main_providers/UserContext";
import { DBProvider } from "@/providers/db_providers/DBContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Bendly.io Dashboard",
  description: "Bendly.io Dashboard",
};

const robot_flex = Roboto_Flex({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robot_flex.className}`}>
        {/* <body> */}
        <UserProvider>
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
        </UserProvider>
      </body>
    </html>
  );
}
