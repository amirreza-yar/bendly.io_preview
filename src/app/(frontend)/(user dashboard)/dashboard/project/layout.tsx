import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import { ReactNode } from "react";

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />

      {children}

      <BottomNav />
    </>
  );
}
