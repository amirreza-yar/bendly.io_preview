import { ChevronDown } from "@/components/icons";
import FlashingSVG from "@/components/utils/flashingSVG";
import { StoredFlashing } from "@/types/flashingTypes";
import { Flashing, PaymentHistory } from "@/types/orders/orderType";
import { StoredOrderFlashing } from "@/types/orderTypes";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ComponentPropsWithoutRef } from "react";

type OrderSpecificationAccordionProp = {
  flashings: Flashing[];
};

export function OrderSpecificationAccordion({
  flashings,
}: OrderSpecificationAccordionProp) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      type="single"
      collapsible
      defaultValue="item-1"
      className="grid gap-y-4 divide-y divide-border-seprator items-center"
    >
      {flashings.map((flash, index) => (
        <AccordionPrimitive.Item key={index} value={flash.flashingId}>
          <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className="w-full flex justify-between items-start text-sm font-medium transition-all outline-none [&[data-state=open]>svg]:rotate-180 pb-4"
          >
            <div className="flex gap-3">
              <span className="w-16 h-16 rounded-md border border-border-default" />
              <div className="flex-col flex items-start gap-2">
                <p className="label-regular">
                  {flash.material} / {flash.color}
                </p>
                <p className="caption-small">Thickness: {flash.thickness}mm</p>
                <p className="caption-small">
                  Quantity:{" "}
                  {flash.sepcifications.reduce(
                    (sum: number, spec: any) => sum + spec.quantity,
                    0,
                  )}{" "}
                  pcs
                </p>
              </div>
            </div>
            <ChevronDown className="pointer-events-none size-6 shrink-0 translate-y-0.5 transition-transform duration-120" />
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
          >
            <div className="flex justify-between pb-4">
              <div className="grid gap-2 pl-19">
                <p className="label-regular border-b pb-1 pr-2">Quantity</p>
                {flash.sepcifications.map((spec, index) => (
                  <p key={index} className="caption-small">
                    {spec.quantity} pcs
                  </p>
                ))}
              </div>
              <div className="grid gap-2 pr-6">
                <p className="label-regular border-b pb-1 pr-2">Length</p>
                {flash.sepcifications.map((spec, index) => (
                  <p key={index} className="caption-small">
                    {spec.length} mm
                  </p>
                ))}
              </div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

type OrderSummaryAccordionProp = {
  flashings: Flashing[];
};

export function OrderSummeryAccordion({
  flashings,
}: OrderSummaryAccordionProp) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      type="single"
      collapsible
      defaultValue="item-1"
      className="grid gap-4 items-center"
    >
      {flashings.map((flash, index) => (
        <AccordionPrimitive.Item
          defaultChecked
          key={index}
          value={flash.flashingId}
        >
          <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className="w-full text-sm font-medium transition-all outline-none [&[data-state=open]_svg]:rotate-180"
          >
            <p className="label-regular flex gap-[2px] items-center pb-1.5">
              Flashing #<span>{index + 1}</span> - {flash.material} /{" "}
              {flash.color}
            </p>
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex-col flex items-start gap-2">
                <p className="caption-small">
                  Quantity:{" "}
                  {flash.sepcifications.reduce(
                    (sum: number, spec: any) => sum + spec.quantity,
                    0,
                  )}{" "}
                  pcs
                </p>
              </div>
              <div className="flex items-center gap-1 label-regular ">
                Subtotal:
                <p className="text-success">
                  $
                  {flash.sepcifications
                    .reduce((sum: number, spec: any) => sum + spec.cost, 0)
                    .toFixed(2)}{" "}
                </p>
                <ChevronDown className="mb-1 pointer-events-none size-6 shrink-0 translate-y-0.5 transition-transform duration-120" />
              </div>
            </div>
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
          >
            <div className="flex justify-between pb-4">
              <div className="w-full grid gap-2 pl-4 pr-8">
                {flash.sepcifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between caption-small"
                  >
                    <p className="text-subtitle">
                      {spec.quantity} pcs x {spec.length}mm
                    </p>
                    <p className="text-success">${spec.cost.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

// type NewOrderSummaryAccordionProp = {
//   flashings:
//     | (StoredFlashing & Pick<StoredOrderFlashing, 'code' | 'position' | 'specifications'>)[]
//     | Array<
//         Partial<StoredFlashing> & Pick<StoredOrderFlashing, 'code' | 'position' | 'specifications'>
//       >
//     | undefined
// }

export function NewOrderSummaryAccordion({ flashings }: { flashings: any }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      type="single"
      collapsible
      defaultValue="item-1"
      className="grid gap-y-4 items-center"
    >
      {flashings &&
        flashings.map((flash: any, index: any) => (
          <AccordionPrimitive.Item key={index} value={flash.id ?? ""}>
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              className="w-full flex justify-between text-sm font-medium transition-all outline-none [&[data-state=open]_#chevron]:rotate-180 pb-4"
            >
              <div className="flex gap-3 w-full">
                <FlashingSVG
                  flashing={flash}
                  path3DOffsetCoeff={0.7}
                  strokeWidthCoeff={35}
                  className="w-20 h-16 p-1 bg-gray-50 rounded-md border border-border-default"
                />
                <div className="grid items-center justify-items-stretch w-full">
                  <p className="text-sm justify-self-start">
                    {flash.material_data.name} .{" "}
                    {flash.material_data.type === "color"
                      ? flash.material_data?.label
                      : `${flash.material_data?.value} mm`}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="label-small">
                      Qty:{" "}
                      {flash.specifications?.reduce(
                        (sum: number, spec: any) => sum + spec.quantity,
                        0,
                      )}{" "}
                      pcs
                    </p>
                    <div className="flex gap-1 items-center">
                      <p className="label-small">
                        Subtotal:{" "}
                        <span className="text-success">
                          $
                          {flash.specifications
                            ?.reduce(
                              (sum: any, spec: any) => sum + (spec?.cost ?? 0),
                              0,
                            )
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </span>
                      </p>
                      <ChevronDown
                        id="chevron"
                        className="pointer-events-none size-5 shrink-0 translate-y-0.5 transition-transform duration-200 mb-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionPrimitive.Trigger>
            <AccordionPrimitive.Content
              data-slot="accordion-content"
              className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
            >
              <div className="flex justify-between pb-4">
                <div className="grid gap-2 pl-19">
                  {flash.specifications?.map((spec: any, index: number) => (
                    <p
                      key={index}
                      className="caption-small text-muted-foreground"
                    >
                      {spec.quantity} x {spec.length} mm
                    </p>
                  ))}
                </div>
                <div className="grid gap-2 pr-6">
                  {flash.specifications?.map((spec: any, index: number) => (
                    <p key={index} className="caption-small text-success">
                      ${spec.cost?.toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
    </AccordionPrimitive.Root>
  );
}
