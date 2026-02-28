"use client";
import {
  HomeNav,
  HomeNavBold,
  LibraryNav,
  LibraryNavBold,
} from "../uikit/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orders, OrdersBold, Templates, TemplatesBold } from "../icons";
import { Button } from "../ui/button";
import { cn } from "@/utilities/ui";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    match: (path: string) =>
      path === "/dashboard" || path.startsWith("/dashboard/setting"),
    Icon: HomeNav,
    ActiveIcon: HomeNavBold,
  },
  {
    label: "Templates",
    href: "/dashboard/library",
    match: (path: string) => path.startsWith("/dashboard/library"),
    Icon: Templates,
    ActiveIcon: TemplatesBold,
  },
  {
    label: "Order",
    href: "/dashboard/order",
    match: (path: string) => path.startsWith("/dashboard/order"),
    Icon: Orders,
    ActiveIcon: OrdersBold,
  },
  {
    label: "Projects",
    href: "/dashboard/project",
    match: (path: string) => path.startsWith("/dashboard/project"),
    Icon: LibraryNav,
    ActiveIcon: LibraryNavBold,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed md:max-w-120 bottom-0 md:bottom-4 w-screen h-17 bg-background rounded-t-lg md:rounded-lg shadow-md left-1/2 -translate-x-1/2">
      <div className="h-full  flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          const Icon = isActive ? item.ActiveIcon : item.Icon;

          return (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col size-15 gap-1 [&_svg]:size-6! text-gray-400",
                isActive && "text-primary hover:text-primary",
              )}
            >
              <Link href={item.href}>
                <Icon />
                <p className="label-small">{item.label}</p>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
