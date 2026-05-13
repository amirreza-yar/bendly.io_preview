"use client";

import { Node, Order } from "@/types/api";
import InvoiceDetailsPDF from "./details";
import InvoiceFlashingPDF from "./flashing";
import InvoiceFooterPDF from "./footer";
import InvoiceHeaderPDF from "./header";
import InvoicePagePDF from "./page-skeleton";
import InvoicePricesPDF from "./prices";
import { Document, Font } from "@react-pdf/renderer";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

function formatDate(input: string) {
  const date = new Date(input);

  if (isNaN(date.getTime())) return ""; // invalid date guard

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = days[date.getDay()];
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${dayName}-${month}/${day}`;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function InvoiceDocument({ order }: { order: Order }) {
  Font.register({
    family: "RobotoFlex",
    fonts: [
      {
        src: "/fonts/roboto-medium.ttf",
        fontWeight: "medium",
      },
      {
        src: "/fonts/roboto-bold.ttf",
        fontWeight: "bold",
      },
      //   {
      //     src: '/fonts/roboto-flex.woff',
      //
      //     fontWeight: 700,
      //   },
    ],
  });

  const demo = [0, 1, 2];

  //   const data = {
  //     id: "531210",
  //     client: {
  //       id: 5,
  //       email: "demo@domain.co",
  //       first_name: "Demo",
  //       last_name: "User",
  //       full_name: "Demo User",
  //     },
  //     status: "pending",
  //     priority: "medium",
  //     fulfillment_type: "delivery",
  //     job_reference: {
  //       code: 1234,
  //       project_name: "New Main Cite",
  //     },
  //     flashings: [
  //       {
  //         id: 3,
  //         code: "20UM",
  //         position: "LSW01",
  //         start_crush_fold: false,
  //         end_crush_fold: false,
  //         color_side_dir: false,
  //         tapered: false,
  //         nodes: [
  //           {
  //             node_id: "y52y1c",
  //             left: 100,
  //             top: 300,
  //             next_node_id: "3qoqx2",
  //           },
  //           {
  //             node_id: "3qoqx2",
  //             left: 50,
  //             top: 500,
  //             prev_node_id: "y52y1c",
  //             next_node_id: "tusps8",
  //           },
  //           {
  //             node_id: "tusps8",
  //             left: 200,
  //             top: 550,
  //             prev_node_id: "3qoqx2",
  //             next_node_id: "ffe5nn",
  //           },
  //           {
  //             node_id: "ffe5nn",
  //             left: 200,
  //             top: 350,
  //             prev_node_id: "tusps8",
  //             next_node_id: "tdn5q0",
  //           },
  //           {
  //             node_id: "tdn5q0",
  //             left: 250,
  //             top: 250,
  //             prev_node_id: "ffe5nn",
  //           },
  //         ],
  //         total_girth: 676.0725631642915,
  //         material_data: {
  //           type: "color",
  //           name: "Pre-painted steel",
  //           label: "Manor Red",
  //           value: "#8B3A3A",
  //         },
  //         specifications: [
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //           //   {
  //           //     quantity: 2,
  //           //     length: 1360.0,
  //           //     cost: 350.88,
  //           //   },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         code: "20UM",
  //         position: "LSW01",
  //         start_crush_fold: false,
  //         end_crush_fold: false,
  //         color_side_dir: false,
  //         tapered: false,
  //         nodes: [
  //           {
  //             node_id: "y52y1c",
  //             left: 100,
  //             top: 300,
  //             next_node_id: "3qoqx2",
  //           },
  //           {
  //             node_id: "3qoqx2",
  //             left: 50,
  //             top: 500,
  //             prev_node_id: "y52y1c",
  //             next_node_id: "tusps8",
  //           },
  //           {
  //             node_id: "tusps8",
  //             left: 200,
  //             top: 550,
  //             prev_node_id: "3qoqx2",
  //             next_node_id: "ffe5nn",
  //           },
  //           {
  //             node_id: "ffe5nn",
  //             left: 200,
  //             top: 350,
  //             prev_node_id: "tusps8",
  //             next_node_id: "tdn5q0",
  //           },
  //           {
  //             node_id: "tdn5q0",
  //             left: 250,
  //             top: 250,
  //             prev_node_id: "ffe5nn",
  //           },
  //         ],
  //         total_girth: 676.0725631642915,
  //         material_data: {
  //           type: "color",
  //           name: "Pre-painted steel",
  //           label: "Manor Red",
  //           value: "#8B3A3A",
  //         },
  //         specifications: [
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         code: "20UM",
  //         position: "LSW01",
  //         start_crush_fold: false,
  //         end_crush_fold: false,
  //         color_side_dir: false,
  //         tapered: false,
  //         nodes: [
  //           {
  //             node_id: "y52y1c",
  //             left: 100,
  //             top: 300,
  //             next_node_id: "3qoqx2",
  //           },
  //           {
  //             node_id: "3qoqx2",
  //             left: 50,
  //             top: 500,
  //             prev_node_id: "y52y1c",
  //             next_node_id: "tusps8",
  //           },
  //           {
  //             node_id: "tusps8",
  //             left: 200,
  //             top: 550,
  //             prev_node_id: "3qoqx2",
  //             next_node_id: "ffe5nn",
  //           },
  //           {
  //             node_id: "ffe5nn",
  //             left: 200,
  //             top: 350,
  //             prev_node_id: "tusps8",
  //             next_node_id: "tdn5q0",
  //           },
  //           {
  //             node_id: "tdn5q0",
  //             left: 250,
  //             top: 250,
  //             prev_node_id: "ffe5nn",
  //           },
  //         ],
  //         total_girth: 676.0725631642915,
  //         material_data: {
  //           type: "color",
  //           name: "Pre-painted steel",
  //           label: "Manor Red",
  //           value: "#8B3A3A",
  //         },
  //         specifications: [
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         code: "20UM",
  //         position: "LSW01",
  //         start_crush_fold: false,
  //         end_crush_fold: false,
  //         color_side_dir: false,
  //         tapered: false,
  //         nodes: [
  //           {
  //             node_id: "y52y1c",
  //             left: 100,
  //             top: 300,
  //             next_node_id: "3qoqx2",
  //           },
  //           {
  //             node_id: "3qoqx2",
  //             left: 50,
  //             top: 500,
  //             prev_node_id: "y52y1c",
  //             next_node_id: "tusps8",
  //           },
  //           {
  //             node_id: "tusps8",
  //             left: 200,
  //             top: 550,
  //             prev_node_id: "3qoqx2",
  //             next_node_id: "ffe5nn",
  //           },
  //           {
  //             node_id: "ffe5nn",
  //             left: 200,
  //             top: 350,
  //             prev_node_id: "tusps8",
  //             next_node_id: "tdn5q0",
  //           },
  //           {
  //             node_id: "tdn5q0",
  //             left: 250,
  //             top: 250,
  //             prev_node_id: "ffe5nn",
  //           },
  //         ],
  //         total_girth: 676.0725631642915,
  //         material_data: {
  //           type: "color",
  //           name: "Pre-painted steel",
  //           label: "Manor Red",
  //           value: "#8B3A3A",
  //         },
  //         specifications: [
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         code: "20UM",
  //         position: "LSW01",
  //         start_crush_fold: false,
  //         end_crush_fold: false,
  //         color_side_dir: false,
  //         tapered: false,
  //         nodes: [
  //           {
  //             node_id: "y52y1c",
  //             left: 100,
  //             top: 300,
  //             next_node_id: "3qoqx2",
  //           },
  //           {
  //             node_id: "3qoqx2",
  //             left: 50,
  //             top: 500,
  //             prev_node_id: "y52y1c",
  //             next_node_id: "tusps8",
  //           },
  //           {
  //             node_id: "tusps8",
  //             left: 200,
  //             top: 550,
  //             prev_node_id: "3qoqx2",
  //             next_node_id: "ffe5nn",
  //           },
  //           {
  //             node_id: "ffe5nn",
  //             left: 200,
  //             top: 350,
  //             prev_node_id: "tusps8",
  //             next_node_id: "tdn5q0",
  //           },
  //           {
  //             node_id: "tdn5q0",
  //             left: 250,
  //             top: 250,
  //             prev_node_id: "ffe5nn",
  //           },
  //         ],
  //         total_girth: 676.0725631642915,
  //         material_data: {
  //           type: "color",
  //           name: "Pre-painted steel",
  //           label: "Manor Red",
  //           value: "#8B3A3A",
  //         },
  //         specifications: [
  //           {
  //             quantity: 5,
  //             length: 3600.0,
  //             cost: 2322.0,
  //           },
  //           {
  //             quantity: 9,
  //             length: 7600.0,
  //             cost: 8823.6,
  //           },
  //           {
  //             quantity: 2,
  //             length: 1360.0,
  //             cost: 350.88,
  //           },
  //         ],
  //       },
  //     ],
  //     created_at: "2025-12-21T05:01:44.749085Z",
  //     fulfillment: {
  //       type: "delivery",
  //       cost: 50.02,
  //       date: "2025-12-28",
  //       address: {
  //         title: "Home",
  //         street_address: "123 Maint st.",
  //         suburb: "Sydney",
  //         state: "NSW",
  //         postcode: 2000,
  //         distance_to_factory: 500,
  //         recipient_name: "Amirreza Yarahmadi",
  //         recipient_phone: "1231231231",
  //         full_address: "123 Maint st., Sydney, NSW 2000, Australia",
  //       },
  //       method: {
  //         _dm_type: "factory",
  //         _dm_name: "Van",
  //         _dm_description: "",
  //         _dm_base_cost: 70.0,
  //         _dm_cost_per_kg: 2.0,
  //         _dm_cost_per_km: 1.25,
  //       },
  //       driver: null,
  //     },
  //     payment_history: {
  //       transaction_id: "pi_3Sgelz2Tb35ankTn1ijh45G4",
  //       method: "stripe",
  //       date: "2025-12-21T05:01:44.775766Z",
  //       amount: 14736.15,
  //       gst: 0.1,
  //       flashings_cost: 11496.48,
  //       delivery_cost: 50.02,
  //     },
  //   };

  const PAGE_MAX_HEIGHT = 792;

  const pageFooter = {
    id: order.id,
  };

  const cleanedData: {
    details?: {
      name: string;
      address: string;
      phone: number;
      email: string;
      delivery_type: string;
      id: string;
      due_date: string;
    };
    flashings?: {
      id: string | number;
      code: string;
      material: string;
      total_girth: string;
      details: {
        quantity: number;
        length: number;
        cost: number;
      }[];
      nodes: (
        | {
            node_id: string;
            left: number;
            top: number;
            next_node_id: string;
          }
        | {
            node_id: string;
            left: number;
            top: number;
            prev_node_id: string;
            next_node_id: string;
          }
        | {
            node_id: string;
            left: number;
            top: number;
            prev_node_id: string;
          }
        | Node
      )[];
      start_crush_fold: boolean;
      end_crush_fold: boolean;
      color_side_dir: boolean;
      tapered: boolean;
    }[];
    prices?: {
      id: string;
      price: string;
    }[];
    totalPrice?: string;
  }[] = [
    {
      details: {
        name: order.client.full_name,
        address: order.fulfillment.address.full_address,
        phone: 671234567890,
        email: order.client.email,
        delivery_type: order.fulfillment_type,
        id: order.id,
        due_date: formatDate(order.fulfillment.date),
      },
    },
  ];

  const flashings = order.flashings;

  let flashingsIndex = 1;
  let pageSizeLeft = PAGE_MAX_HEIGHT - 150;

  for (const flash of flashings) {
    let baseFlashHeight = 210;

    if (flash.specifications.length > 6) {
      baseFlashHeight += (flash.specifications.length - 6) * 25;
    }

    if (pageSizeLeft < baseFlashHeight) {
      cleanedData.push({
        flashings: [
          {
            id: flash.id,
            code: `Flashing #${flashingsIndex} - ${flash.code}`,
            material: `${flash.material_data.name} / ${flash.material_data.label}`,
            total_girth: Math.round(flash.total_girth).toFixed(0),
            details: flash.specifications,
            nodes: flash.nodes,
            start_crush_fold: flash.start_crush_fold,
            end_crush_fold: flash.end_crush_fold,
            color_side_dir: flash.color_side_dir,
            tapered: flash.tapered,
          },
        ],
      });

      pageSizeLeft = PAGE_MAX_HEIGHT - baseFlashHeight;
    } else {
      if (
        typeof cleanedData[cleanedData.length - 1].flashings?.length ===
        "number"
      ) {
        cleanedData[cleanedData.length - 1].flashings?.push({
          id: flash.id,
          code: `Flashing #${flashingsIndex} - ${flash.code}`,
          material: `${flash.material_data.name} / ${flash.material_data.label}`,
          total_girth: Math.round(flash.total_girth).toFixed(0),
          details: flash.specifications,
          nodes: flash.nodes,
          start_crush_fold: flash.start_crush_fold,
          end_crush_fold: flash.end_crush_fold,
          color_side_dir: flash.color_side_dir,
          tapered: flash.tapered,
        });
      } else {
        cleanedData[cleanedData.length - 1].flashings = [
          {
            id: flash.id,
            code: `Flashing #${flashingsIndex} - ${flash.code}`,
            material: `${flash.material_data.name} / ${flash.material_data.label}`,
            total_girth: Math.round(flash.total_girth).toFixed(0),
            details: flash.specifications,
            nodes: flash.nodes,
            start_crush_fold: flash.start_crush_fold,
            end_crush_fold: flash.end_crush_fold,
            color_side_dir: flash.color_side_dir,
            tapered: flash.tapered,
          },
        ];
      }

      flashingsIndex += 1;
      pageSizeLeft -= baseFlashHeight;
    }
  }

  const prices = [];
  let totalPrice = 0;
  let flashIndex = 1;

  for (const flash of flashings) {
    let cost = 0;
    for (const spec of flash.specifications) {
      cost += spec.cost;
    }

    totalPrice += cost;

    prices.push({
      id: `Flashing #${flashIndex} - ${flash.code}`,
      price: formatPrice(cost),
    });

    flashIndex += 1;
  }

  if (pageSizeLeft > 120 + 46 * flashings.length) {
    cleanedData[cleanedData.length - 1].prices = prices;
    cleanedData[cleanedData.length - 1].totalPrice = formatPrice(totalPrice);
  } else {
    cleanedData.push({
      prices: prices,
      totalPrice: formatPrice(totalPrice),
    });
  }

  if (!cleanedData) return <></>;

  return (
    <Document>
      {cleanedData.map((page, index) => {
        return (
          <InvoicePagePDF key={index}>
            {page.details && (
              <>
                <InvoiceHeaderPDF />

                <InvoiceDetailsPDF details={page.details} />
              </>
            )}

            {page.flashings?.map((flash, index) => (
              <InvoiceFlashingPDF key={index} flash={flash} />
            ))}

            {page.prices && page.totalPrice && (
              <InvoicePricesPDF
                prices={page.prices}
                totalPrice={page.totalPrice}
              />
            )}

            <InvoiceFooterPDF />
          </InvoicePagePDF>
        );
      })}
      {/* <InvoicePagePDF>
        {[0, 1].map((_, index) => (
          <InvoiceFlashingPDF key={index} />
        ))}

        <InvoicePricesPDF />

        <InvoiceFooterPDF />
      </InvoicePagePDF> */}

      {/* <InvoicePagePDF>
        {[0, 1, 2].map((_, index) => (
          <InvoiceFlashingPDF key={index} />
        ))}

        <InvoicePricesPDF />

        <InvoiceFooterPDF />
      </InvoicePagePDF> */}
    </Document>
  );
}

export default function ExportOrderPDFLink({
  order,
  children,
  className,
}: {
  order: Order;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument order={order} />}
      fileName={`bendlyio-order-invoice-${order.id}.pdf`}
      className={className}
    >
      {children}
    </PDFDownloadLink>
  );
}
