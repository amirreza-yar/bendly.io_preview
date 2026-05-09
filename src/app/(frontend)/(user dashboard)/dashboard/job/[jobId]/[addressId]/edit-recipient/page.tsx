"use client";
import { useForm } from "react-hook-form";
import { LabeledInput, LabeledInputWithCode } from "@/components/uikit/input";
import { Button } from "@/components/uikit/buttons/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/uikit/form";
import { Footer } from "@/components/dashboard/footer";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { useEffect } from "react";

const recipientInfoSchema = z.object({
  name: z
    .string("Full name is required")
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters"),

  phone: z
    .string("Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid phone number"),
});

type RecipientInfoValues = z.infer<typeof recipientInfoSchema>;

export default function EditRecipientPage({}) {
  const { jobId, addressId } = useParams<{
    jobId: string;
    addressId: string;
  }>();

  const { data: recipientData } = useSWR(
    `/a/job-ref/${jobId}/address/${addressId}`,
    fetcher,
    {
      onError: () => notFound(),
    },
  );

  const { data: userInfo } = useSWR("/a/profile/", fetcher);

  const router = useRouter();

  const recipientInfoForm = useForm<RecipientInfoValues>({
    resolver: zodResolver(recipientInfoSchema),
  });

  useEffect(() => {
    if (!recipientData || !recipientInfoForm) return;

    recipientInfoForm.setValue(
      "phone",
      String(recipientData?.recipient_phone)?.slice(2),
    );
    recipientInfoForm.setValue("name", recipientData?.recipient_name);
  }, [recipientInfoForm, recipientData]);

  const onRecipientInfoFormSubmit = async (data: RecipientInfoValues) => {
    try {
      await api.patch(`/a/job-ref/${jobId}/address/${addressId}/`, {
        recipient_name: data.name,
        recipient_phone: `+61${data.phone}`,
      });

      toast("Recipient Updated");
      router.replace(`/dashboard/j/${jobId}/${addressId}`);
    } catch (error: any) {
      toast("Something went wrong");
    }
  };

  return (
    <>
      <Header
        title="Edit Recipient"
        returnHref={`/dashboard/j/${jobId}/${addressId}`}
      />
      <ContentWrapper className="pt-18">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h6 className="text-smd-m">Who will receive order delivery?</h6>
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                recipientInfoForm.setValue(
                  "name",
                  `${userInfo?.first_name} ${userInfo?.last_name}`,
                );
                recipientInfoForm.setValue(
                  "phone",
                  String(userInfo?.phone).slice(2),
                );
              }}
            >
              Set my info
            </Button>
          </div>
          <Form {...recipientInfoForm}>
            <form
              className="h-full space-y-4"
              onSubmit={recipientInfoForm.handleSubmit(
                onRecipientInfoFormSubmit,
              )}
            >
              <FormField
                control={recipientInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LabeledInput
                        label="Recipient Full Name"
                        required
                        type="text"
                        placeholder="e.g., Jon Doe"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recipientInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LabeledInputWithCode
                        label="Recipient Phone Number"
                        required
                        type="text"
                        placeholder="e.g., 400123456"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Footer>
                <Button type="submit" className="w-full bg-primary">
                  Edit Recipient Details
                </Button>
              </Footer>
            </form>
          </Form>
        </div>
      </ContentWrapper>
    </>
  );
}
