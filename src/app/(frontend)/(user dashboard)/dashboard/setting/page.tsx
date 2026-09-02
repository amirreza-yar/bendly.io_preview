import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import {
  ArrowLeft,
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
import { Button } from "@/components/ui/button";
import MainWrapper from "@/components/main-wrapper";

const onLogout: () => Promise<{ ok: boolean; message?: string }> = async () => {
  "use server";

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("auth-jwt")?.value;
    
    await api.post(
      `/auth/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      },
    );

    cookieStore.delete("auth-jwt")
    cookieStore.delete("auth-refresh-jwt")



    return { ok: true };
  } catch (error: any) {
    console.error(error, error.response.data, error.request);

    const cookieStore = await cookies();

    cookieStore.delete("auth-jwt")
    cookieStore.delete("auth-refresh-jwt")
    
    try {
      return { ok: true, message: error.response.data };
    } catch {
      return { ok: true };
    }
  }
};

export default async function SettingsPage() {
  return (
    <>
      <MainWrapper title="Settings" returnHref="/dashboard">
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full px-4 py-4">
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
            {/* <p className="text-base font-semibold pl-2 pt-6.5">
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
              </Item> */}

            <p className="text-base font-semibold pl-2 pt-6 pb-2">
              Help & Support
            </p>
            <Item variant="default" className="gap-1 pr-4 pl-0 py-1" asChild>
              <Link href="/faq">
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
              <Link href="/tips">
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

            {/* <Item variant="default" className="gap-1 pr-4 pl-0 py-1" asChild>
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
            </Item> */}

            <p className="text-base font-semibold pl-2 pt-4">Legal</p>
            <Item variant="default" className="gap-1 pr-4 pl-0 py-2" asChild>
              <Link href="/privacy-policy">
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
              <Link href="/terms">
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
      </MainWrapper>
    </>
  );
}
