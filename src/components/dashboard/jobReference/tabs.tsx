import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { TabsContent } from "@radix-ui/react-tabs";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/uikit/form";
import { LabeledInput, LabeledInputWithCode } from "@/components/uikit/input";
import { ReactNode } from "react";
import { Select } from "@/components/uikit/select";
import { Separator } from "@/components/uikit/separator";
import { Button } from "@/components/uikit/buttons/button";
import { Edit, Info, MapMarker } from "@/components/uikit/icons";

const australianStates = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

export const AddressFormTab = ({
  tabValue,
  addressForm,
  Header,
  Footer,
  className,
}: {
  tabValue: string;
  addressForm: UseFormReturn<any>;
  Header: ReactNode;
  Footer: ReactNode;
  className?: string;
}) => {
  return (
    <TabsContent value={tabValue} className={className}>
      {Header}
      <ContentWrapper className="pb-24">
        <div className="space-y-4">
          <FormField
            control={addressForm.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Street Address"
                    required
                    type="text"
                    placeholder="e.g., 123 Main St"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addressForm.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Suburb"
                    required
                    type="text"
                    placeholder="e.g., Sydney"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addressForm.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <Select
                      label="State/Territory"
                      items={australianStates}
                      placeholder="Select state / territory"
                      required
                      {...field}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addressForm.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Postcode"
                    required
                    type="text"
                    placeholder="e.g., 2000"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <FormField
            control={addressForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Address Title / Site Name"
                    required
                    type="text"
                    placeholder="Eneter a name for Site / Address"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {Footer}
      </ContentWrapper>
    </TabsContent>
  );
};

export const RecipientFormTab = ({
  tabValue,
  recipientForm,
  Header,
  Footer,
  className,
  showAddress = false,
  onAddressCardClick,
}: {
  tabValue: string;
  recipientForm: UseFormReturn<any>;
  Header: ReactNode;
  Footer: ReactNode;
  className?: string;
  showAddress?: boolean;
  onAddressCardClick?: (props: any) => void;
}) => {
  const watched = recipientForm.watch();

  return (
    <TabsContent value={tabValue} className={className}>
      {Header}
      <ContentWrapper className="pb-24 flex flex-col">
        {showAddress && (
          <button
            onClick={onAddressCardClick}
            className="flex flex-col gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mb-4 cursor-pointer"
          >
            <Edit className="absolute top-3 right-3 size-5" />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <MapMarker className="size-5" />
                <div className="flex flex-col gap-1 items-start truncate">
                  <p className="label-regular">{watched?.title}</p>
                  <p className="body-small">
                    {watched?.street}, {watched?.suburb}, {watched?.state}{" "}
                    {watched?.postcode}
                  </p>
                </div>
              </div>
            </div>
          </button>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h6 className="text-smd-m">Who will receive order delivery?</h6>
            <Button
              variant="ghost"
              size="default"
              type="button"
              onClick={() => {
                recipientForm.setValue("name", "Amirreza Yarahmadi");
                recipientForm.setValue("phone", "1231231231");
              }}
            >
              Set my info
            </Button>
          </div>
          <FormField
            control={recipientForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Recipient Full Name"
                    required
                    type="text"
                    placeholder="e.g., Jon Doe"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={recipientForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInputWithCode
                    label="Recipient Phone Number"
                    required
                    type="text"
                    placeholder="e.g., 400123456"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {Footer}
      </ContentWrapper>
    </TabsContent>
  );
};

export const JobRefFormTab = ({
  tabValue,
  jobRefForm,
  Header,
  Footer,
  className,
}: {
  tabValue: string;
  jobRefForm: UseFormReturn<any>;
  Header: ReactNode;
  Footer: ReactNode;
  className?: string;
}) => {
  return (
    <TabsContent value={tabValue} className={className}>
      {Header}
      <ContentWrapper className="pb-24">
        <div className="space-y-4">
          <div className="bg-surface-info-subtle text-primary-dark rounded-md p-3 body-small flex items-start gap-3">
            <Info className="size-4 mt-1" />
            <p>Each Job Reference can include multiple delivery addresses</p>
          </div>
          <FormField
            control={jobRefForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Job Refrence Code"
                    required
                    type="text"
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
            control={jobRefForm.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabeledInput
                    label="Project Name (Optional)"
                    required
                    type="text"
                    placeholder="Enter your project name"
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
        </div>
        {Footer}
      </ContentWrapper>
    </TabsContent>
  );
};
