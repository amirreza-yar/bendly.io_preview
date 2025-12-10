"use client";

import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Header } from "@/components/dashboard/header";
import { useParams, useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/uikit/form";
import { LabeledInput, LabeledInputWithCode } from "@/components/uikit/input";
import { Button } from "@/components/uikit/buttons/button";
import { useState } from "react";
import { Select } from "@/components/uikit/select";
import { Separator } from "@/components/uikit/separator";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Footer } from "@/components/dashboard/footer";
import {
  AddressFormTab,
  JobRefFormTab,
  RecipientFormTab,
} from "@/components/dashboard/jobReference/tabs";
import { ArrowLeft, Edit, MapMarker } from "@/components/uikit/icons";

const NewJobRefFormSchema = z.object({
  code: z.string("Code is required").nonempty("Job reference code is required"),
  projectName: z.string().optional(),
  title: z
    .string("Address Title / Site Name is required")
    .nonempty("Address Title / Site Name is required")
    .max(100, "Address title must be under 100 characters"),

  street: z
    .string("Street Address is required")
    .nonempty("Street Address is required")
    .regex(
      /^[a-zA-Z0-9\s,'\.-]+$/,
      "Street address can only contain letters, numbers, spaces, comma, hyphen, dot, and apostrophe"
    )
    .max(100, "Street address must be under 100 characters"),

  suburb: z
    .string("Suburb is required")
    .nonempty("Suburb is required")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Suburb must contain only letters, spaces, and hyphens"
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

export type NewJobRefFormValues = z.infer<typeof NewJobRefFormSchema>;

export default function NewAddressPage() {
  const { jobId } = useParams<{ jobId: string }>();

  const [tabValue, setTabValue] = useState("job-tab");

  const newJobRefForm = useForm<NewJobRefFormValues>({
    resolver: zodResolver(NewJobRefFormSchema),
  });

  const router = useRouter();

  const onNewJobRefFormSubmit = async (data: NewJobRefFormValues) => {
    console.log(data);
    try {
      const res = await api.post(`/d/job-ref/`, {
        code: data.code,
        project_name: data.projectName,
        addresses: [
          {
            title: data.title,
            street_address: data.street,
            suburb: data.suburb,
            state: data.state,
            postcode: data.postcode,
            recipient_name: data.name,
            recipient_phone: data.phone,
          },
        ],
      });

      console.log(res);

      toast("New Job Reference Added");
      router.push(`/dashboard/j/${res.data.id}`);
    } catch (error: any) {
      toast("Something went wrong");
    }
  };

  const handleNextPage = async () => {
    if (tabValue === "job-tab") {
      const validation = await newJobRefForm.trigger(["code", "projectName"]);

      if (validation) {
        setTabValue("address-tab");
      }
    } else if (tabValue === "address-tab") {
      const validation = await newJobRefForm.trigger([
        "suburb",
        "street",
        "postcode",
        "state",
        "title",
      ]);

      if (validation) {
        setTabValue("recipient-tab");
      }
    }
  };

  const handlePrevPage = async () => {
    if (tabValue === "address-tab") {
      setTabValue("job-tab");
    } else if (tabValue === "recipient-tab") {
      setTabValue("address-tab");
    }
  };

  return (
    <>
      <Tabs className="h-full" value={tabValue} onValueChange={setTabValue}>
        <Form {...newJobRefForm}>
          <form
            className="h-full"
            onSubmit={newJobRefForm.handleSubmit(onNewJobRefFormSubmit)}
          >
            <JobRefFormTab
              tabValue="job-tab"
              jobRefForm={newJobRefForm}
              Header={
                <Header title="Basic Information" returnHref="/dashboard/j" />
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

            <AddressFormTab
              tabValue="address-tab"
              addressForm={newJobRefForm}
              Header={
                <Header
                  title="Address Details"
                  onReturnButtonClick={handlePrevPage}
                />
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
              recipientForm={newJobRefForm}
              showAddress={true}
              onAddressCardClick={() => setTabValue("address-tab")}
              Header={
                <>
                  <Header
                    title="Recipient Details"
                    onReturnButtonClick={handlePrevPage}
                  />
                </>
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
