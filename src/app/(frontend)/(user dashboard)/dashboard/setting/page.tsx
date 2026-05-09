import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import {
  ChatBubleCircleQuestion,
  CircleQuestion,
  Document,
  ProfileNav,
  Ruler,
  ScrollPrivacyUp,
} from "@/components/icons";
import { ChevronRight, LifeBuoy } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cookies } from "next/headers";
import api from "@/lib/axios";
import LogoutModal from "@/components/dashboard/logout-modal";

const onLogout: () => Promise<{ ok: boolean; message?: string }> = async () => {
  "use server";

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("auth-jwt")?.value;

    const res = await api.post(
      `/auth/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    cookieStore.set("auth-jwt", "");
    cookieStore.set("auth-refresh-jwt", "");

    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error(error, error.response.data, error.request);
    try {
      return { ok: false, message: error.response.data };
    } catch {
      return { ok: false };
    }
  }
};

export default async function SettingsPage() {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <h6 className="absolute top-5 left-5 text-primary-foreground">
          Settings
        </h6>
      </div>
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md h-full">
          <ScrollArea className="h-full">
            <div className="flex flex-col h-full px-4 pb-4">
              <p className="text-base font-semibold pb-3">Edit Profile</p>
              <Item variant="outline" className="gap-1 pr-4 pl-2 py-3" asChild>
                <Link href="/dashboard/setting/account">
                  <ItemMedia variant="image">
                    <ProfileNav />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Account Details</ItemTitle>
                    <ItemDescription>
                      Name, Password, Phone number
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>
              <p className="text-base font-semibold pl-2 pt-6.5">
                Global Settings
              </p>
              <Item variant="default" className="gap-1 pr-4 pl-2 py-3" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <Ruler className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Units</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>

              <p className="text-base font-semibold pl-2 pt-3 pb-2">
                Help & Support
              </p>
              <Item variant="default" className="gap-1 pr-4 pl-0 py-1" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <CircleQuestion className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>FAQs</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>
              <Item variant="default" className="gap-1 pr-4 pl-0 py-1" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <LifeBuoy className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Help & Tips</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>

              <Item variant="default" className="gap-1 pr-4 pl-0 py-1" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <ChatBubleCircleQuestion className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Support</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>

              <p className="text-base font-semibold pl-2 pt-4">Legal</p>
              <Item variant="default" className="gap-1 pr-4 pl-0 py-2" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <ScrollPrivacyUp className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Privacy Policy</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>
              <Item variant="default" className="gap-1 pr-4 pl-0 py-2" asChild>
                <Link href="">
                  <ItemMedia variant="image">
                    <Document className="size-6" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>Terms of Use</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight />
                  </ItemActions>
                </Link>
              </Item>

              <LogoutModal onAction={onLogout} />
            </div>
          </ScrollArea>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
