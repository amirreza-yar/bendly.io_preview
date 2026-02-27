"use client";
import BottomNav from "@/components/dashboard/bottom-nav";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import {
  ArrowLeft,
  ChatBubleCircleQuestion,
  CircleQuestion,
  Document,
  Logout,
  ProfileNav,
  Ruler,
  ScrollPrivacyUp,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ChevronRight, LifeBuoy } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed left-1 top-1 flex items-center gap-2 text-primary-foreground">
          <Button
            variant="ghost"
            size="icon-lg"
            className="hover:bg-transparent hover:text-primary-light"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h6>Settings</h6>
        </div>
        <UILayoutContentWrapper className="top-0 mt-15 pb-20">
          <UILayoutContent className="py-4 flex flex-col">
            <p className="text-lg font-bold pb-3">Edit Profile</p>
            <Item variant="outline" className="gap-1 pr-4 pl-2 py-3" asChild>
              <Link href="/dashboard/setting/account">
                <ItemMedia variant="image">
                  <ProfileNav />
                </ItemMedia>
                <ItemContent className="gap-1">
                  <ItemTitle>Account Information</ItemTitle>
                  <ItemDescription>
                    Name, Password, Phone number
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRight />
                </ItemActions>
              </Link>
            </Item>
            <p className="text-lg font-bold pl-2 pt-6.5">Global Setting</p>
            <Item variant="default" className="gap-1 pr-4 pl-2 py-3" asChild>
              <Link href="">
                <ItemMedia variant="image">
                  <Ruler className="size-6" />
                </ItemMedia>
                <ItemContent className="gap-1">
                  <ItemTitle>Measurement</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRight />
                </ItemActions>
              </Link>
            </Item>

            <p className="text-lg font-bold pl-2 pt-3 pb-2">Help & Support</p>
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

            <p className="text-lg font-bold pl-2 pt-4">Legal</p>
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
                  <ItemTitle>Term of Use</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRight />
                </ItemActions>
              </Link>
            </Item>
          </UILayoutContent>
          <UILayoutContent className="mt-2 p-0">
            <Item className="py-3 px-5 text-destructive hover:bg-destructive-subtle/30 cursor-pointer">
              <ItemMedia className="p-0">
                <Logout className="size-6" />
              </ItemMedia>
              <ItemContent className="p-0">
                <ItemHeader>Logout</ItemHeader>
              </ItemContent>
              <ItemActions>
                <ChevronRight />
              </ItemActions>
            </Item>
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>
      <BottomNav />
    </>
  );
}
