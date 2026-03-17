"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/uikit/input";
import { Button } from "@/components/uikit/buttons/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormMessage,
} from "@/components/uikit/form";
import { Footer } from "@/components/dashboard/footer";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";

const formSchema = z.object({
  code: z
    .string()
    .nonempty("Job reference code is required")
    .regex(/^[0-9]+$/, "Digits only"),
  project_name: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function JobReferencesPage({}) {
  const { jobId } = useParams<{ jobId: string }>();

  const { data, error, isLoading } = useSWR(`/a/job-ref/${jobId}`, fetcher);

  if ((!isLoading && data === undefined) || error) {
    notFound();
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: data.code,
      project_name: data.project_name,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      await api.patch(`/a/job-ref/${jobId}/`, {
        code: Number(data.code),
        project_name: data.project_name,
      });

      toast("Job Reference Updated");
      router.push(`/dashboard/j/${jobId}`);
    } catch (error: any) {
      const detail = error?.response?.data;
      if (detail.code) {
        form.setError("code", { message: detail.code[0] });
      } else {
        toast("Something went wrong");
      }
    }
  };

  const { isDirty } = form.formState;

  return (
    <>
      <Header
        title="Edit Basic Infromation"
        returnHref={`/dashboard/j/${data?.id}`}
      />
      <ContentWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Refrence Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter unique Job Reference code"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>
                    A unique code you assign to identify this job
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Refrence Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter unique Job Reference code"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>
                    Name this job reference for easy identification
                  </FormMessage>
                </FormItem>
              )}
            />
            <Footer>
              <Button type="submit" className="w-full" disabled={!isDirty}>
                Next
              </Button>
            </Footer>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
}
