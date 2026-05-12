import {
  CircleQuestion,
  Delivery,
  Orders,
  Resize,
  Templates,
  User,
} from "@/components/icons";
import MainWrapper from "@/components/main-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePile, HandCoins, Info, ShieldCheck } from "lucide-react";

const faqs = [
  //   {
  //     title: "General",
  //     Icon: Info,
  //     qs: [
  //       {
  //         q: "What is Bendly?",
  //         a: "Bendly is an online flashing ordering platform that allows customers to design, customize, and submit flashing orders directly to connected factories.",
  //       },
  //     ],
  //   },

  {
    title: "Account & Access",
    Icon: User,
    qs: [
      {
        q: "How do I create a Bendly account?",
        a: "You can create an account by selecting “Sign Up” on the login screen and entering your details, including your name, email address and password.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Use the “Forgot Password?” option on the login screen and follow the instructions sent to your email address to reset your password.",
      },
      {
        q: "I can’t log in to my account. What should I do?",
        a: "Please check that your email address and password are entered correctly. If the issue continues, try resetting your password or contact support for assistance.",
      },
      {
        q: "Can I update my personal information?",
        a: "Yes. You can update your personal information, including your name, phone number and email address, through your account settings.",
      },
      {
        q: "Do I need to create an account to use Bendly?",
        a: "Yes. A Bendly account is required to create designs, manage projects, submit orders and track order history.",
      },
      {
        q: "Can I use Bendly on mobile devices?",
        a: "Yes. Bendly is designed to work on supported mobile devices and tablets.",
      },
      {
        q: "Can I access my previous orders later?",
        a: "Yes. Your order history and project records are available through your Bendly account.",
      },
      {
        q: "Can I deactivate my account?",
        a: "Yes. Accounts can be deactivated through account settings. Certain operational records may still be retained securely for legal and factory record purposes.",
      },
      {
        q: "What happens to my order history after account deactivation?",
        a: "Certain records may be securely retained for operational, legal, and factory record-keeping purposes.",
      },
    ],
  },

  {
    title: "Orders & Production",
    Icon: Orders,
    qs: [
      {
        q: "Can I edit my order after payment?",
        a: "Orders cannot be edited after payment. If changes are required, contact the factory or support team as soon as possible.",
      },
      {
        q: "Can I cancel my order?",
        a: "Order cancellations are subject to factory approval. Please contact the factory or support team immediately if cancellation is required.",
      },
      {
        q: "Can a factory reject my order?",
        a: "Yes. Factories may reject orders due to unavailable materials, unsupported geometry, production limitations, or other operational reasons. If this occurs, the factory will contact you directly.",
      },
      {
        q: "Can pricing change after order submission?",
        a: "Pricing is calculated automatically based on factory rules. If additional costs or production issues are identified, the factory must contact the customer before making any pricing changes.",
      },
      {
        q: "How long does production take?",
        a: "Production time varies depending on the selected factory, material availability, order complexity, and workload.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Order status updates are available through the Orders section in your Bendly account.",
      },
    ],
  },

  {
    title: "Measurements & Design",
    Icon: Resize,
    qs: [
      {
        q: "What measurement system does Bendly use?",
        a: "Bendly supports both millimetres (mm) and inches (in).",
      },
      {
        q: "Are dimensions measured from the colour side?",
        a: "Yes. Bendly uses colour-side face dimensions unless otherwise specified.",
      },
      {
        q: "Does Bendly calculate bend deductions automatically?",
        a: "No. Bendly does not automatically calculate bend deductions or allowances unless configured by the factory.",
      },
      {
        q: "What is the maximum flashing length?",
        a: "Maximum supported flashing length is typically up to 10 metres, depending on factory capability.",
      },
      {
        q: "What is the maximum girth?",
        a: "Maximum girth depends on material availability and factory equipment. Many factories support up to approximately 1200 mm.",
      },
      {
        q: "Does Bendly support tapered flashings?",
        a: "Yes. Tapered flashing profiles are supported.",
      },
      {
        q: "Do crush folds affect pricing?",
        a: "Yes. Additional folds, tapering, and manufacturing complexity may affect pricing.",
      },
      {
        q: "Can I create custom flashing profiles?",
        a: "Yes. Bendly supports fully custom flashing designs.",
      },
      {
        q: "What happens if my design cannot be manufactured?",
        a: "If a flashing design exceeds factory limitations or requires clarification, the factory will contact you before production begins.",
      },
    ],
  },

  {
    title: "Materials & Manufacturing",
    Icon: CirclePile,
    qs: [
      {
        q: "Which materials are available?",
        a: "Available materials depend on the connected factory and its inventory configuration.",
      },
      {
        q: "Which thicknesses are available?",
        a: "Material thickness options are managed by each factory individually.",
      },
      {
        q: "Can I request custom colours?",
        a: "Custom colours may be available upon request. Please contact the factory directly for additional colour options.",
      },
      {
        q: "Are colours shown on screen accurate?",
        a: "Colours shown within Bendly are approximate only and may vary from the final manufactured product.",
      },
      {
        q: "Who is responsible for checking dimensions and specifications?",
        a: "Customers are responsible for reviewing and confirming all dimensions, specifications, quantities, and selections before submitting an order.",
      },
      {
        q: "Does Bendly guarantee installation suitability?",
        a: "No. Bendly is an ordering platform only. Final installation suitability and manufacturing responsibility remain with the factory and customer.",
      },
    ],
  },

  {
    title: "Projects & Templates",
    Icon: Templates,
    qs: [
      {
        q: "Can I save templates for future use?",
        a: "Yes. Bendly supports reusable templates to help speed up future orders.",
      },
      {
        q: "What is the difference between App Templates and My Templates?",
        a: "App Templates are factory or platform-provided templates and cannot be edited. My Templates are fully editable personal templates created by users.",
      },
      {
        q: "Can I reorder a previous flashing?",
        a: "Yes. Previous orders and templates can be reused for faster ordering.",
      },
      {
        q: "Can I edit my saved templates?",
        a: "Yes. User-created templates are fully editable.",
      },
    ],
  },

  {
    title: "Delivery & Pickup",
    Icon: Delivery,
    qs: [
      {
        q: "Can I use multiple delivery addresses?",
        a: "Yes. Each project can contain multiple delivery addresses.",
      },
      {
        q: "Are delivery dates guaranteed?",
        a: "No. Delivery dates are estimates only and may vary depending on production schedules and logistics.",
      },
      {
        q: "Can I select pickup instead of delivery?",
        a: "Available delivery and pickup options depend on the connected factory.",
      },
    ],
  },

  {
    title: "Payments & Refunds",
    Icon: HandCoins,
    qs: [
      {
        q: "How are payments processed?",
        a: "Payments are securely processed using Stripe and are paid directly to the selected factory.",
      },
      {
        q: "Does Bendly collect payments?",
        a: "No. Bendly does not collect customer payments directly.",
      },
      {
        q: "Is GST included?",
        a: "GST visibility depends on factory configuration and will be shown during checkout and invoicing where applicable.",
      },
      {
        q: "Will I receive an invoice?",
        a: "Yes. Invoices and order confirmations are automatically generated after successful payment.",
      },
      {
        q: "What if there is a problem with my order?",
        a: "Customers can submit replacement or support requests through Bendly. Final assessment and resolution are handled by the connected factory.",
      },
    ],
  },

  {
    title: "Privacy",
    Icon: ShieldCheck,
    qs: [
      {
        q: "Is my data secure?",
        a: "Bendly uses secure authentication and industry-standard security measures to help protect your account and order information.",
      },
      {
        q: "Who can access my orders and project information?",
        a: "Only the connected factory associated with your orders can access related order information.",
      },
    ],
  },

  {
    title: "Support",
    Icon: CircleQuestion,
    qs: [
      {
        q: "How do I contact support?",
        a: "Support requests can be submitted directly through the Bendly support page.",
      },
      {
        q: "How long does support take to respond?",
        a: "Support requests are typically answered within 24 business hours.",
      },
      {
        q: "Does Bendly provide phone support?",
        a: "Support begins through email. Phone support may be provided if required.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <MainWrapper title="FAQs" returnHref="/dashboard/setting">
      <ScrollArea className="h-full px-4">
        <div className="h-full space-y-6 py-4">
          <h6 className="font-bold">Frequently Asked Questions</h6>
          <Accordion type="multiple" className="w-full -mt-2">
            <AccordionItem value="000" className="border rounded-xl px-4">
              <AccordionTrigger>What is Bendly?</AccordionTrigger>
              <AccordionContent>
                Bendly is an online flashing ordering platform that allows
                customers to design, customize, and submit flashing orders
                directly to connected factories.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {faqs.map((f, findex) => (
            <Accordion
              key={f.title}
              type="multiple"
              className="w-full space-y-3"
            >
              <div className="flex items-center gap-2 font-medium">
                <f.Icon className="size-5" />
                {f.title}
              </div>
              {f.qs.map((qa, qaindex) => (
                <AccordionItem
                  key={`${findex}-${qaindex}`}
                  value={`${findex}-${qaindex}`}
                  className="border rounded-xl px-4"
                >
                  <AccordionTrigger>{qa.q}</AccordionTrigger>
                  <AccordionContent>{qa.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </ScrollArea>
    </MainWrapper>
  );
}
