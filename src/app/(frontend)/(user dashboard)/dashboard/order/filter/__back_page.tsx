"use client";

import { OrderFilterContent } from "@/components/order/content";
import { Button } from "@/components/ui/button";
import { Material } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

export default function OrderFilterPage({
  materials,
}: {
  materials: Material[];
}) {
  const filtersFormSchema = z.object({
    materials: z
      .array(z.number())
      .refine(
        (value) => value.every((mat) => materials?.some((a) => a.id === mat)),
        {
          message: "You selected an invalid material",
        },
      ),

    price: z
      .array(z.number())
      .length(2)
      .refine(([min, max]) => min <= max, {
        message: "Invalid range",
      }),
    due_date_range: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine((data) => data.from <= data.to, {
        message: "Invalid date range",
      })
      .partial(),
  });

  const filtersForm = useForm<z.infer<typeof filtersFormSchema>>({
    resolver: zodResolver(filtersFormSchema),
    defaultValues: {
      materials: [],
      price: [100, 1000000],
      due_date_range: {},
    },
  });

  return (
    <>
      Order filter page
      {/* <div className="flex items-center h-13 pl-1 pr-4 transition-all">
        <Button
          variant="ghost"
          size="icon-lg"
          className="hover:bg-transparent hover:text-primary-light"
          onClick={() => setTabValue("active-orders")}
        >
          <ArrowLeft />
        </Button>
        <InputGroup className="bg-background text-foreground">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search order..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />

          <InputGroupButton
            onClick={() => setSearchVal("")}
            className={cn(
              "transition-opacity duration-200",
              searchVal.length > 0
                ? "opacity-100"
                : "opacity-0 pointer-events-none",
            )}
          >
            <X />
          </InputGroupButton>
        </InputGroup>
      </div>

      <div className="fixed h-screen w-screen bg-background text-foreground relative">
        <div className="fixed z-10 top-0 w-full">
          <div className="flex items-center gap-4 pl-3 py-3 bg-background text-foreground">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href="/dashboard/order">
                <X className="size-5" />
              </Link>
            </Button>
            <h6>Filters</h6>
          </div>
        </div>
        <div
          className={`pointer-events-none -mt-1 h-5 w-full
                              bg-gradient-to-b from-gray-400/50 to-transparent 
                              transition-opacity duration-200
                              ${showShadow ? "opacity-100" : "opacity-0"}`}
        />
        <div className="relative">
          <div
            ref={ref}
            onScroll={onScroll}
            className="fixed top-14 w-full h-[calc(100vh-125px)] overflow-scroll px-4 pt-1 bg-background text-foreground"
          >
            <form
              id="filters-form"
              onSubmit={filtersForm.handleSubmit(onFilterOrders)}
            >
              <FieldGroup>
                <Controller
                  name="materials"
                  control={filtersForm.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLegend>Materials</FieldLegend>
                      <FieldGroup data-slot="checkbox-group">
                        <div className="grid grid-cols-2 gap-3">
                          {materials.map((mat) => (
                            <Field
                              key={mat.id}
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <Checkbox
                                id={`filters-form-${mat.id}`}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value.includes(mat.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, mat.id]
                                    : field.value.filter(
                                        (value) => value !== mat.id,
                                      );
                                  field.onChange(newValue);
                                  field.onBlur();
                                }}
                              />
                              <FieldContent>
                                <FieldLabel htmlFor={`filters-form-${mat.id}`}>
                                  {mat.name}
                                </FieldLabel>
                              </FieldContent>
                            </Field>
                          ))}
                        </div>
                      </FieldGroup>
                    </FieldSet>
                  )}
                />
                <FieldSeparator className="mx-6" />

                <Controller
                  name="price"
                  control={filtersForm.control}
                  render={({ field, fieldState }) => (
                    <FieldSet aria-invalid>
                      <FieldLegend>Price</FieldLegend>
                      <FieldGroup data-slot="checkbox-group" className="px-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-label-2xs text-gray-dark">
                              From
                            </p>
                            <p className="text-body-sm">
                              {formatPrice(field.value[0])}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-label-2xs text-gray-dark">To</p>
                            <p className="text-body-sm">
                              {formatPrice(field.value[1])}
                            </p>
                          </div>
                        </div>
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <Slider
                            min={100}
                            max={1000000}
                            step={100}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FieldContent>
                            <FieldLabel htmlFor=""></FieldLabel>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  )}
                />

                <FieldSeparator className="mx-6" />

                <Controller
                  name="due_date_range"
                  control={filtersForm.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLegend>Delivery Date</FieldLegend>
                      <FieldGroup data-slot="checkbox-group" className="px-4">
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                          className="mb-4 px-6 py-4 border rounded-md"
                        >
                          <Calendar
                            mode="range"
                            numberOfMonths={1}
                            // @ts-expect-error The calendar work either way
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value?.from}
                            className="w-full p-2"
                          />
                          <FieldContent>
                            <FieldLabel htmlFor=""></FieldLabel>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  )}
                />
              </FieldGroup>
            </form>
          </div>
        </div>

        <div className="fixed bottom-0 w-full px-4 pb-4 bg-background text-foreground">
          <div className="border-t flex items-center justify-between pt-4">
            <Button variant="link" onClick={() => filtersForm.reset()}>
              Clear all
            </Button>
            <Button type="submit" form="filters-form">
              Apply changes
            </Button>
          </div>
        </div>
      </div> */}
    </>
  );
}
