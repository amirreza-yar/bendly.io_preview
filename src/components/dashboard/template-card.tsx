"use client";
import { ComponentProps, useState } from "react";
import FlashingSVG from "../utils/flashingSVG";
import { Template } from "@/types/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Remove } from "../icons";
import { Plus, XIcon } from "lucide-react";
import z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const editTemplateFormSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(29, "Name must be at most 30 characters"),
});

export default function TemplateCard({
  template,
  isAppTemplate,
  onEditTemplate,
  ...props
}: {
  template: Template;
  isAppTemplate: boolean;
  onEditTemplate: (
    id: string | number,
    name: string,
  ) => Promise<{ data?: any; ok: boolean; error?: string }>;
} & ComponentProps<"div">) {
  const router = useRouter();
  const [templateModalOpen, setTemplateModalOpen] = useState<boolean>(false);

  const editTemplateForm = useForm<z.infer<typeof editTemplateFormSchema>>({
    resolver: zodResolver(editTemplateFormSchema),
    defaultValues: { name: template.name },
  });

  const handleEditTemplate = async (
    data: z.infer<typeof editTemplateFormSchema>,
  ) => {
    const res = await onEditTemplate(template.id, data.name);
    console.log(res);
    if (res.ok) {
      toast("Template updated");
      setTemplateModalOpen(false);
      router.refresh();
    } else {
      toast("Couldn't updated template");
    }
  };

  const hasNameChanged = useWatch({
    control: editTemplateForm.control,
    name: "name",
    compute: (val: string) => {
      const defaultName = editTemplateForm.formState.defaultValues?.name;
      return val !== defaultName;
    },
  });

  return (
    <Dialog open={templateModalOpen}>
      <DialogTrigger>
        <div
          className="flex flex-col gap-1.5 justify-center rounded-xl p-2 pt-1 border"
          onClick={() => setTemplateModalOpen(true)}
          {...props}
        >
          <FlashingSVG
            flashing={{
              nodes: template.nodes,
              startCrushFold: template.start_crush_fold,
              endCrushFold: template.end_crush_fold,
              colorSideDirection: template.color_side_dir,
            }}
            className="size-25 md:size-30 w-full mx-auto px-1.5 py-1.5 md:px-3 md:py-3"
          />

          <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
            {template.name}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <form
          className="w-full"
          onSubmit={editTemplateForm.handleSubmit(handleEditTemplate)}
        >
          <DialogHeader>
            <DialogTitle />
            <DialogClose asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                className="w-fit absolute top-3 right-5"
                onClick={() => setTemplateModalOpen(false)}
              >
                <XIcon />
              </Button>
            </DialogClose>
            {hasNameChanged && (
              <Button size="sm" className="w-fit absolute top-4 left-4">
                Save
              </Button>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <FlashingSVG
              flashing={{
                nodes: template.nodes,
                startCrushFold: template.start_crush_fold,
                endCrushFold: template.end_crush_fold,
                colorSideDirection: template.color_side_dir,
              }}
              className="h-30 md:h-40 w-full mx-auto px-1 py-1.5 md:px-2 md:py-3 mb-2"
            />

            <div className="border-t w-full" />

            <Controller
              control={editTemplateForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="text-center text-sm rounded-full h-8"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <div className="flex justify-center gap-3 pt-4 px-4">
              {!isAppTemplate && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-primary">
                      <Remove />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="h-0!">
                      <DialogTitle />
                    </DialogHeader>
                    <div className="flex flex-col gap-2 justify-center">
                      <h5 className="w-fit text-base mx-auto font-medium pb-2">
                        Delete this template?
                      </h5>
                      <FlashingSVG
                        flashing={{
                          nodes: template.nodes,
                          startCrushFold: template.start_crush_fold,
                          endCrushFold: template.end_crush_fold,
                          colorSideDirection: template.color_side_dir,
                        }}
                        className="h-25 md:h-30 w-full mx-auto px-1 py-1.5 md:px-2 md:py-3 mb-2"
                      />

                      <div className="border-t w-full" />

                      <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
                        {template.name}
                      </p>

                      <div className="flex gap-3 px-4 justify-center pt-5">
                        <Button variant="destructive">
                          <Remove />
                          Delete
                        </Button>
                        <DialogClose asChild>
                          <Button variant="ghost" className="text-primary">
                            Cancel
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button>
                <Plus />
                Add to Order
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
