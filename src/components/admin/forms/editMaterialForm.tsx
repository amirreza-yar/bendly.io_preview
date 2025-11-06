'use client'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, LabeledInput } from '@/components/uikit/input'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import {
  Delete,
  Edit,
  Minus,
  More,
  Overview,
  OverviewBold,
  Plus,
  PlusIcon,
} from '@/components/uikit/icons'
import { toast } from 'sonner'
import { Button } from '@/components/uikit/buttons/button'
import { cn } from '@/utilities/ui'
import { DotSquare, MoreHorizontal, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/uikit/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/uikit/popover'
import { PopoverClose } from '@radix-ui/react-popover'

const SpecSchema = z.object({
  name: z.string('Required field').min(1, '??'),
  code: z.string('Req'),
})

const DetailsFormSchema = z.object({
  material: z.string().nonempty('Required field'),
  baseCost: z.number('Required field 2'),
  costPerFold: z.number('Required field'),
  squishCost: z.number('Required field'),
  costPer100Girth: z.number('Required field'),
  colors: z
    .array(SpecSchema)
    .nonempty('At least one color is required')
    .refine((arr) => arr.every((s) => typeof s.name === 'string' && typeof s.code === 'string'), {
      message: 'Each Variant must have name and code',
    }),
})

export type EditMaterialFormValues = z.infer<typeof DetailsFormSchema>

let data: any = {
  material: 'Pre-painted steel',
  groups: [
    {
      groupName: 'Base Group',
      colors: [
        { name: 'Monument', code: '#504A4B' },
        { name: 'Surfmist', code: '#ECE7E1' },
        { name: 'Shale Grey', code: '#7D7D7D' },
        { name: 'Woodland Grey', code: '#5C6A6A' },
        { name: 'Manor Red', code: '#8B3A3A' },
      ],
      baseCost: 5,
      costPerFold: 2,
      squishCost: 4,
      costPer100Girth: 3,
    },
    {
      groupName: 'Secondary Group',
      colors: [
        { name: 'Surfmist', code: '#ECE7E1' },
        { name: 'Classic Cream', code: '#F1E3C4' },
        { name: 'Paperbark', code: '#D2C0A2' },
        { name: 'Shale Grey', code: '#7D7D7D' },
        { name: 'Dune', code: '#B6A998' },
      ],
      baseCost: 8,
      costPerFold: 3,
      squishCost: 6,
      costPer100Girth: 5,
    },
  ],
}

export default function EditMaterialForm({
  onEditMaterialFormSubmit,
  setIsEditMaterialModalOpen,
  materialDetails,
}: {
  onEditMaterialFormSubmit: (data: EditMaterialFormValues) => void
  setIsEditMaterialModalOpen: (param: boolean) => void
  materialDetails: any
}) {
  const form = useForm<EditMaterialFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: { colors: [{ name: undefined, code: undefined }] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'colors',
  })

  useEffect(() => {
    form.reset({
      material: materialDetails.material,
      baseCost: materialDetails.groups[0].baseCost,
      costPerFold: materialDetails.groups[0].costPerFold,
      squishCost: materialDetails.groups[0].squishCost,
      costPer100Girth: materialDetails.groups[0].costPer100Girth,
      colors: materialDetails.groups[0].colors,
    })
  }, [materialDetails, form])

  const { isDirty } = form.formState

  const colors = form.watch('colors') || []

  const [currentGroupData, setCurrentGroupData] = useState(data.groups[0])

  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0)

  const [newGroupName, setNewGroupName] = useState<string>('')

  return (
    <>
      <Form {...form}>
        <form id="edit-material-form" onSubmit={form.handleSubmit(onEditMaterialFormSubmit)}>
          <div className="flex min-h-[75vh]">
            <div className="w-70 bg-gray-200 rounded-tl-lg rounded-bl-lg shadow-md border-r border-gray-300 p-4 pt-6 flex flex-col gap-2">
              <h6>Material name and groups</h6>
              <p className="subtitle-regular ">Edit material name or groups.</p>
              <p className="label-regular text-gray-600 pt-2">Name</p>
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Material name"
                        className="border-1 bg-gray-50"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="label-regular text-gray-600 pt-3 pb-2">Groups</p>
              <div className="flex flex-col grow overflow-y-scroll">
                <div className="flex flex-col gap-3">
                  {materialDetails.groups.map((group: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        'w-full rounded-md text-[15px]/[20px] font-semibold flex items-center justify-between p-3 cursor-pointer',
                        activeGroupIndex === index
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-300 hover:bg-gray-400',
                      )}
                      onClick={() => {
                        const groupData = materialDetails.groups[index]
                        setActiveGroupIndex(index)
                        form.reset({
                          material: materialDetails.material,
                          baseCost: groupData.baseCost,
                          costPerFold: groupData.costPerFold,
                          squishCost: groupData.squishCost,
                          costPer100Girth: groupData.costPer100Girth,
                          colors: groupData.colors,
                        })
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {activeGroupIndex === index ? (
                          <OverviewBold className="size-4" />
                        ) : (
                          <Overview className="size-4" />
                        )}
                        {group.groupName}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MoreHorizontal className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-25">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="text-[15px]/[25px]" onSelect={() => {}}>
                              <Edit />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[15px]/[25px] text-red-600"
                              onSelect={() => {}}
                            >
                              <Delete className="text-red-500" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger className="w-full rounded-md hover:bg-gray-300 transition-all cursor-pointer text-gray-600 text-[14px] font-semibold flex items-center justify-center gap-2 p-3">
                    <PlusIcon className="size-4" />
                    New Group
                  </PopoverTrigger>

                  <PopoverContent side="top" className="space-y-2">
                    <h6>New Material Group</h6>
                    <p className="label-regular text-gray-400 pb-2">
                      Give the new material group a name
                    </p>
                    <Input
                      placeholder="Group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="border-1 bg-gray-50"
                    />
                    <div className="flex justify-end items-center gap-2 pt-4">
                      <PopoverClose asChild>
                        <Button variant="secondary">Discard</Button>
                      </PopoverClose>
                      <PopoverClose asChild>
                        <Button
                          onClick={() => {
                            materialDetails.groups.push({
                              groupName: newGroupName,
                              colors: [],
                              baseCost: null,
                              costPerFold: null,
                              squishCost: null,
                              costPer100Girth: null,
                            })
                            form.reset({
                              material: materialDetails.material,
                              colors: [],
                            })
                            setActiveGroupIndex(materialDetails.groups.length - 1)
                          }}
                        >
                          Create
                        </Button>
                      </PopoverClose>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-6 p-6">
              <div className="flex flex-col col-span-2">
                <h6>Properties and cost</h6>
                <p className="subtitle-regular py-2">Edit material name or cost.</p>
                <div className="grid grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="baseCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInput
                            label="Base Cost"
                            placeholder="8.00 $"
                            type="number"
                            required
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const v = e.target.value
                              field.onChange(v === '' ? undefined : Number(v))
                            }}
                            badge="$"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPerFold"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInput
                            label="Cost per fold"
                            placeholder="3.00 $"
                            type="number"
                            required
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const v = e.target.value
                              field.onChange(v === '' ? undefined : Number(v))
                            }}
                            badge="$"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="squishCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInput
                            label="Cost per squish fold"
                            placeholder="6.00 $"
                            type="number"
                            required
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const v = e.target.value
                              field.onChange(v === '' ? undefined : Number(v))
                            }}
                            badge="$"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPer100Girth"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInput
                            label="Cost per 100mm girth"
                            placeholder="8.00 $"
                            type="number"
                            required
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const v = e.target.value
                              field.onChange(v === '' ? undefined : Number(v))
                            }}
                            badge="$"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 h-full col-span-3">
                <h6>Variants</h6>
                <p className="subtitle-regular truncate">
                  Use name and pick a color for each color variant you want to add.
                </p>

                <div className="flex flex-col gap-2 grow">
                  <FormField
                    control={form.control}
                    name="colors"
                    render={() => (
                      <div className="grid gap-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-4">
                            <div className="flex w-full gap-4">
                              <div className="grow">
                                {/* name */}
                                <FormField
                                  control={form.control}
                                  name={`colors.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Name
                                        <span className="text-[#E50000]">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          placeholder="Maron"
                                          {...field}
                                          value={field.value ?? ''}
                                          onChange={(e) => {
                                            const v = e.target.value
                                            field.onChange(v === '' ? undefined : v)
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="col-start-3 col-end-6">
                                {/* Length */}
                                <FormField
                                  control={form.control}
                                  name={`colors.${index}.code`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Color
                                        <span className="text-[#E50000]">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          type="color"
                                          className="h-11 w-11 rounded-md border-2 border-border-dark p-2 cursor-pointer hover:border-gray-600 transition-all"
                                          {...field}
                                          value={field.value ?? ''}
                                          onChange={(e) => {
                                            const v = e.target.value
                                            field.onChange(v === '' ? undefined : v)
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            {/* Remove button */}
                            <IconButton
                              type="button"
                              variant="secondary"
                              onClick={() => remove(index)}
                              className="mt-[24px]"
                              disabled={colors.length === 1}
                            >
                              <Minus />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <div className="flex gap-4 pt-2">
                    <div className="grow flex gap-4">
                      <div className="grow opacity-40">
                        <div className="flex gap-2 pb-1 label-regular">
                          Name<span className="text-[#E50000]">*</span>
                        </div>
                        <div className="grow">
                          <Input
                            className="disabled:bg-transparent border-border-dark"
                            placeholder="0"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-start-3 col-end-6 opacity-40">
                        <div className="flex gap-2 pb-1 label-regular">
                          Color<span className="text-[#E50000]">*</span>
                        </div>
                        <div className="flex items-center justify-center h-11 w-11 rounded-md border-2 border-gray-400 p-2">
                          <div className="w-6 h-6 border rounded-full bg-red-400" />
                        </div>
                      </div>
                    </div>
                    <IconButton
                      type="button"
                      variant="secondary"
                      onClick={() => append({ name: undefined as any, code: undefined as any })}
                      className="mt-[20px]"
                      disabled={false}
                    >
                      <Plus />
                    </IconButton>
                  </div>
                </div>
                <div
                  data-slot="alert-dialog-footer"
                  className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
                >
                  <Button type="submit">Submit Changes</Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditMaterialModalOpen(false)
                    }}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
