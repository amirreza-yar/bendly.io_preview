"use client";
import { Button } from "@/components/uikit/buttons/button";
import { LabeledInputWithCode } from "@/components/uikit/input";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/uikit/form";
import { toast } from "sonner";
import api, { fetcher } from "@/lib/axios";
import useSWR from "swr";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

// Validation schema
const EditPhoneFormSchema = z.object({
  phone: z
    .string("Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid phone number"),
});

type EditPhoneFormValues = z.infer<typeof EditPhoneFormSchema>;

export default function EditPhonePage() {
  const router = useRouter();

  const form = useForm<EditPhoneFormValues>({
    resolver: zodResolver(EditPhoneFormSchema),
  });

  const { data, isLoading } = useSWR("/a/profile/", fetcher, {
    onError: () => notFound(),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        phone: `${String(data.phone).slice(2)}`,
      });
    }
  }, [data, form]);

  const onSubmit = async (data: EditPhoneFormValues) => {
    try {
      await api.patch("/a/profile/", {
        phone: `+61${data.phone}`,
      });

      toast("Phone Updated");
      router.replace("/dashboard/account/");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <Header title="Edit Full Name" returnHref="/dashboard/account/edit" />
      <ContentWrapper className="pt-18">
        {/* Give form an ID so Footer button can reference it */}
        <Form {...form}>
          <form
            id="edit-name-form"
            className="grid gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 label-regular">
                    Phone number
                    <span className="text-[#E50000]">*</span>
                  </FormLabel>
                  <FormControl>
                    <LabeledInputWithCode
                      type="number"
                      placeholder="Enter your phone number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ContentWrapper>
      <Footer>
        {/* Button outside form, but linked via form attribute */}
        <Button
          type="submit"
          form="edit-name-form"
          className="w-full bg-primary md:max-w-[700px]"
        >
          Save
        </Button>
      </Footer>
    </>
  );
}
