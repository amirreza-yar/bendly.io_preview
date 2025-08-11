import { AlertDialogContent } from '@/components/uikit/alertModal'
import { Button } from '@/components/uikit/buttons/button'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/uikit/form'
import { Remove, XIcon } from '@/components/uikit/icons'
import { Input } from '@/components/uikit/input'
import { zodResolver } from '@hookform/resolvers/zod'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { useForm, UseFormReturn } from 'react-hook-form'
import z from 'zod'

export const DeleteFlashingModalOnPreview = ({
  deleteFlashing,
}: {
  deleteFlashing: () => void
}) => {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog">
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        <IconButton variant="ghost" black className="hover:bg-white">
          <Remove />
        </IconButton>
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
            <XIcon className="text-neutral-dark" variant="secondary" />
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-sm/[19px] font-semibold"
          >
            Delete Flashing?
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className="text-muted-foreground text-sm"
          >
            Are you sure you want to delete this Flashing? This action cannot be undone.
          </AlertDialogPrimitive.Description>
        </div>
        <div data-slot="alert-dialog-footer" className="flex gap-4 justify-end pt-4">
          <AlertDialogPrimitive.Action asChild>
            <Button variant="ghost">No</Button>
          </AlertDialogPrimitive.Action>

          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="ghost" onClick={deleteFlashing}>
              Yes
            </Button>
          </AlertDialogPrimitive.Cancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  )
}

const TemplateForm = z.object({
  name: z.string('Template name is required').nonempty('Template name is required'),
})

export type TemplateFormValues = z.infer<typeof TemplateForm>

export const AddTemplateModal = ({
  setIsTemplateModalOpen,
  submitTemplate,
  isTemplateModalOpen,
}: {
  setIsTemplateModalOpen: (arg0: boolean) => void
  submitTemplate: (data: TemplateFormValues, form: UseFormReturn<TemplateFormValues>) => void
  isTemplateModalOpen: boolean
}) => {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(TemplateForm),
  })

  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog" open={isTemplateModalOpen}>
      <AlertDialogPrimitive.Trigger
        onClick={() => setIsTemplateModalOpen(true)}
        data-slot="alert-dialog-trigger"
        asChild
      >
        <Button variant="ghost">Save as Template</Button>
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="grid gap-6 w-full">
          <AlertDialogPrimitive.Cancel
            onClick={() => setIsTemplateModalOpen(false)}
            className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6"
          >
            <XIcon className="text-neutral-dark" variant="secondary" />
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-sm/[19px] font-semibold"
          >
            Enter Template name
          </AlertDialogPrimitive.Title>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => submitTemplate(data, form))}
              className="grid gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter template name..."
                        maxLength={30}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <div>
                        <FormMessage />
                      </div>
                      <p className="justify-self-end">{(field.value ?? '').length} / 30</p>
                    </div>
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Save
              </Button>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  )
}
