"use client";
import { Button } from "@/components/uikit/buttons/button";
import Link from "next/link";
import { ButtonListItem } from "@/components/uikit/buttons/buttonListItem";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";

export default function AccountPage() {
  const { isLoading, data } = useSWR("/a/profile/", fetcher);

  return (
    <>
      <Header title="Account" returnHref="/dashboard/account" />

      <ContentWrapper className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4">
        <div className="grid">
          <Link href="/dashboard/account/edit/name">
            <ButtonListItem
              text="Edit Full Name"
              caption={`${data?.first_name} ${data?.last_name}`}
              loading={isLoading}
            />
            <Separator />
          </Link>
          <Link href="/dashboard/account/edit/phone">
            <ButtonListItem
              text="Mobile Number"
              caption={data?.phone ? `${data?.phone}` : "Not set"}
              // badgeText={data?.phone ? "Verified" : "Not Set"}
              // badgeColor={data?.phone ? "green" : "red"}
              loading={isLoading}
            />
          </Link>
        </div>
      </ContentWrapper>

      <Footer>
        <Button className="w-full bg-primary md:max-w-[700px]">Save</Button>
      </Footer>
    </>
  );
}
