"use client";

import { Header } from "@/components/dashboard/header";
import { notFound, useRouter } from "next/navigation";

import { Tabs } from "@radix-ui/react-tabs";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/uikit/form";
import { Button } from "@/components/uikit/buttons/button";
import { use, useEffect, useState } from "react";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import { Footer } from "@/components/dashboard/footer";
import {
  AddressFormTab,
  RecipientFormTab,
} from "@/components/dashboard/jobReference/tabs";
import useSWR from "swr";

const NewAddressFormSchema = z.object({
  title: z
    .string("Address Title / Site Name is required")
    .nonempty("Address Title / Site Name is required")
    .max(100, "Address title must be under 100 characters"),

  street: z
    .string("Street Address is required")
    .nonempty("Street Address is required")
    .regex(
      /^[a-zA-Z0-9\s,'\.-]+$/,
      "Street address can only contain letters, numbers, spaces, comma, hyphen, dot, and apostrophe",
    )
    .max(100, "Street address must be under 100 characters"),

  suburb: z
    .string("Suburb is required")
    .nonempty("Suburb is required")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Suburb must contain only letters, spaces, and hyphens",
    )
    .max(50, "Suburb name must be under 50 characters"),

  state: z.string("State is required").nonempty("State is required"),

  postcode: z
    .string("Postcode is required")
    .regex(/^\d{4}$/, "Enter a valid postcode number"),

  name: z
    .string("Full name is required")
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters"),

  phone: z
    .string("Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid phone number"),
});

export type NewAddressFormValues = z.infer<typeof NewAddressFormSchema>;

export default function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ job_ref_id: string }>;
}) {
  const { job_ref_id } = use(searchParams);

  useEffect(() => {
    if (!job_ref_id) {
      return notFound();
    }
  }, [job_ref_id]);

  const [tabValue, setTabValue] = useState("address-tab");

  const newAddressForm = useForm<NewAddressFormValues>({
    resolver: zodResolver(NewAddressFormSchema),
  });

  const router = useRouter();

  const onNewAddressFormSubmit = async (data: NewAddressFormValues) => {
    try {
      const res = await api.post(`/a/job-ref/${job_ref_id}/address/`, {
        title: data.title,
        street_address: data.street,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        recipient_name: data.name,
        recipient_phone: `+61${data.phone}`,
      });

      toast("New Address Added");
      router.push(
        `/cart/fulfill?address_id=${res.data.id}&job_ref_id=${job_ref_id}`,
      );
    } catch (error: any) {
      toast("Something went wrong");
    }
  };

  const { data: userInfo } = useSWR("/a/profile/", fetcher);

  const handleNextPage = async () => {
    const validation = await newAddressForm.trigger([
      "suburb",
      "street",
      "postcode",
      "state",
      "title",
    ]);

    if (validation) {
      setTabValue("recipient-tab");
    }
  };

  const handlePrevPage = async () => {
    setTabValue("address-tab");
  };

  return (
    <>
      <Tabs
        defaultValue="address-tab"
        className="h-full"
        value={tabValue}
        onValueChange={setTabValue}
      >
        <Form {...newAddressForm}>
          <form
            className="h-full"
            onSubmit={newAddressForm.handleSubmit(onNewAddressFormSubmit)}
          >
            <AddressFormTab
              tabValue="address-tab"
              addressForm={newAddressForm}
              Header={
                <Header title="New Address" returnHref={`/cart/fulfill`} />
              }
              Footer={
                <Footer>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNextPage}
                  >
                    Next
                  </Button>
                </Footer>
              }
            />

            <RecipientFormTab
              tabValue="recipient-tab"
              recipientForm={newAddressForm}
              userInfo={userInfo}
              Header={
                <Header
                  title="New Address Recipient Info"
                  onReturnButtonClick={handlePrevPage}
                />
              }
              Footer={
                <Footer>
                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                </Footer>
              }
            />
          </form>
        </Form>
      </Tabs>
    </>
  );
}
