import {
  InProgress,
  NotProgressed,
  ProgressChecked,
  ProgressRejected,
} from "@/components/uikit/icons";
import { cn } from "@/utilities/ui";

import { RequestProgress } from "@/types/orders/requestType";

interface OrderProgressItem {
  status: string;
  progress: string;
  index: number;
  desc: string;
}

const orderProgresses: OrderProgressItem[] = [
  {
    status: "pending",
    progress: "Order Review",
    index: 0,
    desc: "Reviewing your specifications",
  },
  {
    status: "in_progress",
    progress: "In Progress",
    index: 1,
    desc: "Your order is being manufactured",
  },
  {
    status: "ready",
    progress: "Ready",
    index: 2,
    desc: "Your order is complete and ready for delivery / pickup",
  },
  {
    status: "completed",
    progress: "Completed",
    index: 3,
    desc: "Order delivered / picked up successfully",
  },
];

interface OrderStatusionObjectProps {
  status:
    | "rejected"
    | "pending"
    | "in_progress"
    | "ready"
    | "cancelled"
    | "completed";
}

export function ProgressionObject({ status }: OrderStatusionObjectProps) {
  const progressItem = orderProgresses.find((prog) => prog.status === status);
  console.log("order progression: ", progressItem);
  const progressIndex = progressItem?.index ?? -1;

  if (progressIndex === 3) {
    return (
      <div className="relative mx-2 grid">
        <div className="border-l border-border-info">
          <div className="ms-6">
            <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
              <ProgressChecked className="size-6" />
            </span>
            <span className="label-regular text-body">Order Recieved</span>
            <p className="body-small text-subtitle">
              Your order has been received{" "}
            </p>
          </div>
        </div>
        <div className="grid gap-[5px] -ml-[0.5px] mt-2 mb-3">
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
        </div>
        <div className="ms-6">
          <span className="absolute -start-3 flex w-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
            <ProgressChecked className="size-6" />
          </span>
          <span className="label-regular text-body">Completed</span>
          <p className="body-small text-subtitle">
            Order delivered / picked up successfully
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid mx-2">
        {orderProgresses.map((prog) => (
          <div
            key={prog.index}
            className={cn(
              "relative",
              prog.index !== 3 && "border-l border-border-info"
            )}
          >
            <div className={cn("ms-6", prog.index !== 4 && "mb-5")}>
              <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
                {prog.index <= progressIndex ? (
                  <ProgressChecked className="size-6" />
                ) : prog.index === progressIndex + 1 ? (
                  <InProgress className="size-6" />
                ) : (
                  <NotProgressed className="size-6" />
                )}
              </span>
              <span className="label-regular text-body">{prog.progress}</span>
              <p className="body-small text-subtitle">{prog.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export function RejectedProgressionObject() {
  return (
    <div className="relative mx-2 grid">
      <div className={cn("relative", "border-l border-border-info")}>
        <div className={cn("ms-6")}>
          <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
            <ProgressChecked className="size-6" />
          </span>
          <span className="label-regular text-body">Order Review</span>
          <p className="body-small text-subtitle">
            Reviewing your specifications
          </p>
        </div>
      </div>
      <div className="grid gap-[5px] -ml-[0.5px] mt-2 mb-3">
        <div className="h-[2px] w-[2px] rounded-full bg-primary" />
        <div className="h-[2px] w-[2px] rounded-full bg-primary" />
        <div className="h-[2px] w-[2px] rounded-full bg-primary" />
      </div>
      <div className="relative">
        <div className="ms-6">
          <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
            <ProgressRejected className="size-6" />
          </span>
          <span className="label-regular text-body">Rejected</span>
          <p className="body-small text-subtitle">
            Your request was not approved
          </p>
        </div>
      </div>
    </div>
    // <div className="grid mx-2">
    //   {orderProgresses.slice(0, progressIndex).map((prog) => (
    //     <div
    //       key={prog.index}
    //       className={cn(
    //         "relative",
    //         prog.index !== 4 && "border-l border-border-info"
    //       )}
    //     >
    //       <div className={cn("ms-6", prog.index !== 4 && "mb-5")}>
    //         <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
    //           <ProgressChecked className="size-6" />
    //         </span>
    //         <span className="label-regular text-body">{prog.progress}</span>
    //         <p className="body-small text-subtitle">{prog.desc}</p>
    //       </div>
    //     </div>
    //   ))}

    //   <div key={progressIndex} className="relative">
    //     <div className="ms-6">
    //       <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
    //         <ProgressRejected className="size-6" />
    //       </span>
    //       <span className="label-regular text-body">Rejected</span>
    //       <p className="body-small text-subtitle">
    //         Your request was not approved
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
}

interface RequestProgressItem {
  progress: RequestProgress;
  index: number;
  desc: string;
}

const requestProgresses: RequestProgressItem[] = [
  {
    progress: "Requested",
    index: 0,
    desc: "Your request has been received",
  },
  {
    progress: "Request Review",
    index: 1,
    desc: "Reviewing your specifications",
  },
  {
    progress: "In Production",
    index: 2,
    desc: "Your replacement is being manufactured",
  },
  {
    progress: "Ready",
    index: 3,
    desc: "Your replacement is complete and ready for delivery / pickup",
  },
  {
    progress: "Completed",
    index: 4,
    desc: "The replacement process is complete",
  },
];

interface RequestProgressionObjectProps {
  progress: RequestProgress;
}

export function RequestProgressionObject({
  progress,
}: RequestProgressionObjectProps) {
  const progressItem = requestProgresses.find(
    (prog) => prog.progress === progress
  );
  const progressIndex = progressItem?.index ?? -1;

  if (progressIndex === 4) {
    return (
      <div className="relative mx-2 grid">
        <div className="border-l border-border-info">
          <div className="mb-2 ms-6">
            <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
              <ProgressChecked className="size-6" />
            </span>
            <span className="label-regular text-body">Order Recieved</span>
            <p className="body-small text-subtitle">
              Your order has been received{" "}
            </p>
          </div>
        </div>
        <div className="grid gap-[5px] -ml-[0.5px] mt-2 mb-3">
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
          <div className="h-[2px] w-[2px] rounded-full bg-primary" />
        </div>
        <div className="ms-6">
          <span className="absolute -start-3 flex w-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
            <ProgressChecked className="size-6" />
          </span>
          <span className="label-regular text-body">Completed</span>
          <p className="body-small text-subtitle">
            Order delivered / picked up successfully
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid mx-2">
        {requestProgresses.map((prog) => (
          <div
            key={prog.index}
            className={cn(
              "relative",
              prog.index !== 4 && "border-l border-border-info"
            )}
          >
            <div className={cn("ms-6", prog.index !== 4 && "mb-5")}>
              <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
                {prog.index <= progressIndex ? (
                  <ProgressChecked className="size-6" />
                ) : prog.index === progressIndex + 1 ? (
                  <InProgress className="size-6" />
                ) : (
                  <NotProgressed className="size-6" />
                )}
              </span>
              <span className="label-regular text-body">{prog.progress}</span>
              <p className="body-small text-subtitle">{prog.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export function RejectedRequestProgressionObject({
  progress,
}: RequestProgressionObjectProps) {
  const progressItem = requestProgresses.find(
    (prog) => prog.progress === progress
  );
  const progressIndex = progressItem?.index ?? -1;

  return (
    <div className="grid mx-2">
      {requestProgresses.slice(0, progressIndex).map((prog) => (
        <div
          key={prog.index}
          className={cn(
            "relative",
            prog.index !== 4 && "border-l border-border-info"
          )}
        >
          <div className={cn("ms-6", prog.index !== 4 && "mb-5")}>
            <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
              <ProgressChecked className="size-6" />
            </span>
            <span className="label-regular text-body">{prog.progress}</span>
            <p className="body-small text-subtitle">{prog.desc}</p>
          </div>
        </div>
      ))}

      <div key={progressIndex} className="relative">
        <div className="ms-6">
          <span className="absolute -start-3 flex h-6 items-center justify-center rounded-full bg-white ring-5 ring-white">
            <ProgressRejected className="size-6" />
          </span>
          <span className="label-regular text-body">Rejected</span>
          <p className="body-small text-subtitle">
            Your request was not approved
          </p>
        </div>
      </div>
    </div>
  );
}
