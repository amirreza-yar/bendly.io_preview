import { ThemeProvider } from "@/components/theme-provider";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/providers/main_providers/UserContext";
import { DBProvider } from "@/providers/db_providers/DBContext";

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
      <body
        style={{ width: "100vw", height: "100%" }}
        className={`${robot_flex.className} font-roboto`}
      >
        <UserProvider>
          <Toaster
            position="bottom-center"
            mobileOffset={{ bottom: "96px", right: "0", left: "0" }}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "bg-[#171717] -fit px-6 py-[12.5px] rounded-md max-w-fit mx-auto shadow-md h-12",
                title: "font-roboto text-xs/[22.5px] text-white",
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
              <main className="h-screen relative w-screen overflow-auto no-scrollbar font-roboto max-w-[1000px] mx-auto">
                {children}
              </main>
            </DBProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
