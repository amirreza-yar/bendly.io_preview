import { useScrollShadow } from "@/hooks/use-scroll-shadow";
import { Material, Order } from "@/types/api";
import { OrderCard } from "./cards";
import { SquareLoader } from "../ui/loader";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Controller, UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { formatPrice } from "./utils";
import { Slider } from "../ui/slider";
import { Calendar } from "../ui/calendar";
import { cn } from "@/utilities/ui";
import { Skeleton } from "../ui/skeleton";

export const OrderContent = ({
  order,
  isLoadingMore,
  loadMore,
  type = "active",
  isLoading = true,
  heightClass = "h-[calc(100vh-255px)] md:h-[calc(100vh-275px)]",
  maxHeightClass = "max-h-[calc(100vh-255px)] md:max-h-fit",
}: {
  order: Order[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  type?: "active" | "past" | "search";
  isLoading: boolean;
  heightClass?: string;
  maxHeightClass?: string;
}) => {
  const { showShadow, ref, onScroll } = useScrollShadow(25);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;

    if (nearBottom) {
      loadMore();
    }

    onScroll();
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "space-y-3 overflow-hidden animate-pulse px-4 sm:px-8",
          heightClass,
        )}
      >
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
          <div key={i} className="space-y-1.5 rounded-md p-3 border">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-30" />
              <Skeleton className="h-4 w-15" />
            </div>
            <Skeleton className="h-3 w-35 mt-4" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-45" />

            <div className="flex gap-1 mt-4">
              <Skeleton className="h-8 w-30" />
              <Skeleton className="h-8 w-10" />
            </div>

            <div className="flex justify-between items-end">
              <Skeleton className="h-5 w-25" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!(order.length > 0)) {
    return (
      <div
        className={cn(
          "w-full flex flex-col items-center justify-center px-9 text-center",
          heightClass,
        )}
      >
        <p className="text-subtitle">
          {type === "active"
            ? "No active orders yet"
            : type === "past"
              ? "No past orders yet"
              : "No matching orders found"}
        </p>
        <p className="subtitle-regular text-gray-400 mt-1">
          {type === "active"
            ? "Start designing your flashings and submit your first order."
            : type === "past"
              ? "Once you complete an order, it will appear here for easy reference."
              : "Try adjusting your search terms or filters."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`pointer-events-none absolute top-0 left-0 h-4 w-full
                              bg-gradient-to-b from-gray-400/50 to-transparent 
                              transition-opacity duration-200
                              ${showShadow ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className={cn("w-full overflow-y-auto px-4 sm:px-8", maxHeightClass)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          {order?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
        {isLoadingMore && (
          <div className="col-span-2 flex justify-center pb-4 pt-8">
            <SquareLoader />
          </div>
        )}
      </div>
    </>
  );
};

export const OrderFilterContent = ({
  materials,
  filtersForm,
  onFilterOrders,
}: {
  materials: Material[];
  filtersForm: UseFormReturn<
    {
      materials: number[];
      price: number[];
      due_date_range: {
        from?: Date | undefined;
        to?: Date | undefined;
      };
    },
    any,
    {
      materials: number[];
      price: number[];
      due_date_range: {
        from?: Date | undefined;
        to?: Date | undefined;
      };
    }
  >;
  onFilterOrders: (data: {
    materials: number[];
    price: number[];
    due_date_range: {
      from?: Date | undefined;
      to?: Date | undefined;
    };
  }) => void;
}) => {
  const { showShadow, ref, onScroll } = useScrollShadow(25);

  return (
    <>
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
                          <p className="text-label-2xs text-gray-dark">From</p>
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
    </>
  );
};
