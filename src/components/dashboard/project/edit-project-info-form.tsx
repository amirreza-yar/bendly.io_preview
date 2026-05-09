"use client";

import z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@/types/api";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";

const editProjectInfoFormSchema = z.object({
  code: z
    .string()
    .nonempty("Job reference code is required")
    .regex(/^[0-9]+$/, "Digits only"),
  project_name: z.string().optional(),
});

export default function EditProjectInfoForm({
  project,
  onPatchProjectInfo,
}: {
  project?: Project;
  onPatchProjectInfo: (data: {
    id: string | number;
    code?: string | number;
    project_name?: string;
  }) => Promise<{ ok: boolean; message?: string }>;
}) {
  const editProjectInfoForm = useForm<
    z.infer<typeof editProjectInfoFormSchema>
  >({
    resolver: zodResolver(editProjectInfoFormSchema),
    defaultValues: {
      code: String(project?.code),
      project_name:
        project?.project_name === "No project name assigned"
          ? ""
          : project?.project_name,
    },
  });

  const router = useRouter();

  const isCodeChanged = useWatch({
    control: editProjectInfoForm.control,
    name: "code",
    compute: (val: string) => {
      return val === editProjectInfoForm.formState.defaultValues?.code;
    },
  });

  if (!project || !project.id) return notFound();

  const handleEditProjectInfoSubmit = async (
    data: z.infer<typeof editProjectInfoFormSchema>,
  ) => {
    let subData: {
      id: string | number;
      code?: string | number;
      project_name?: string;
    };

    console.log(data.project_name?.length);

    if (!isCodeChanged) {
      subData = {
        id: project?.id,
        code: data.code,
        project_name:
          (data.project_name?.length ?? 0) > 0
            ? data.project_name
            : "No project name assigned",
      };
    } else {
      subData = {
        id: project?.id,
        project_name:
          (data.project_name?.length ?? 0) > 0
            ? data.project_name
            : "No project name assigned",
      };
    }

    const res = await onPatchProjectInfo(subData);

    if (res.ok) {
      toast("Project updated");
      router.replace(`/dashboard/project/${project.id}`);
    } else {
      if (res.message) {
        toast(res.message);
      } else {
        toast("Couldn't update project");
      }
    }
  };

  return (
    <form
      onSubmit={editProjectInfoForm.handleSubmit(handleEditProjectInfoSubmit)}
      className="h-full"
    >
      <FieldGroup className="relative h-full">
        <FieldSet className="px-4 md:px-6">
          <Controller
            name="code"
            control={editProjectInfoForm.control}
            render={({ field, fieldState }) => {
              const isInvalid = fieldState.invalid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Code <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    placeholder="PRJ-3547"
                  />
                  {!isInvalid ? (
                    <FieldDescription>
                      Unique identifier for this project
                    </FieldDescription>
                  ) : (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="project_name"
            control={editProjectInfoForm.control}
            render={({ field, fieldState }) => {
              const isInvalid = fieldState.invalid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Name (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    placeholder="Downtown Office Renovation"
                  />

                  <FieldDescription>
                    Helps you identify this project later
                  </FieldDescription>
                </Field>
              );
            }}
          />
        </FieldSet>
        <div className="absolute bottom-4 w-full px-4 md:px-6">
          <Field className="w-full">
            <Button size="lg" type="submit" className="w-full">
              Save
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
