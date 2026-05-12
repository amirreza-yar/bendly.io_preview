import ProjectsHeaderWithSearch from "@/components/dashboard/project/projects-header";
import { ReactNode } from "react";

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ProjectsHeaderWithSearch />
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          {children}
        </div>
      </div>
    </>
  );
}
