import { Drawing, IconComponent } from "@/components/icons";
import MainWrapper from "@/components/main-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";

const TipComp = ({
  videoSrc,
  Icon,
  title,
  desc,
}: {
  videoSrc?: string;
  Icon?: IconComponent;
  title: string;
  desc: string;
}) => (
  <div className="rounded-xl p-3 gap-2 flex flex-col justify-between bg-blue-100">
    <div className="space-y-2">
      <div className="flex items-center font-medium gap-2">
        {Icon && <Icon className="size-5" />}
        <p>{title}</p>
      </div>
      <p>{desc}</p>
    </div>
    {videoSrc && (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-h-50 bg-primary-foreground rounded-xl"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    )}
  </div>
);

export default function HelpsTipsPage() {
  return (
    <MainWrapper title="Helps & Tips" returnHref="/dashboard/setting">
      <ScrollArea className="h-full">
        <div className="space-y-6">
          <div className="h-full space-y-4 p-4 sm:p-6">
            <h6>Canvas</h6>
            <div className="grid md:grid-cols-2 gap-5">
              <TipComp
                title="Drawing"
                Icon={Drawing}
                desc="To draw flashing, tap on the canvas and create your shape"
                videoSrc="/videos/tips/draw.mp4"
              />
              <TipComp
                title="Adjust"
                Icon={Drawing}
                desc="To adjust the size, select the desired side or angle, then enter your preferred measurement"
                videoSrc="/videos/tips/adjust.mp4"
              />
              <TipComp
                title="Remove"
                Icon={Drawing}
                desc="Select the line(s) you want to remove, then tap the Remove button to delete them from the design"
                videoSrc="/videos/tips/remove.mp4"
              />
              <TipComp
                title="Taper"
                Icon={Drawing}
                desc="To add a Fold to the shape you've drawn, select the circles at the start or end of the shape. Use the Toggle button to change the Fold's direction"
                videoSrc="/videos/tips/taper.mp4"
              />
              <TipComp
                title="Crush Fold"
                Icon={Drawing}
                desc="To add a Fold to the shape you’ve drawn, select the circles at the start or end of the shape. Use the Toggle button to change the Fold’s direction"
                videoSrc="/videos/tips/fold.mp4"
              />
              <TipComp
                title="Color Side"
                Icon={Drawing}
                desc="By default, the Color side is set to the outer side of the shape. Use the Toggle button to change the direction of the Color side"
                videoSrc="/videos/tips/colorside.mp4"
              />
            </div>
          </div>
          <div className="h-full space-y-4 p-4 sm:p-6">
            <h6>Application</h6>
            <div className="grid md:grid-cols-2 gap-4">
              <TipComp
                title="Order Review"
                desc="You can review your order and edit it if needed. Additionally, you can add another flashing to the same order."
              />
              <TipComp
                title="Projects"
                desc="Projects are used for, anaging your projects and addresses; each project can have multiple addresses."
              />
              <TipComp
                title="Orders"
                desc="Track and manage all your orders in one place. View order details, payment status, and delivery updates instantly."
              />
              <TipComp
                title="Library"
                desc="In the library, you can view, use, and manage your saved templates or utilize pre-defined templates."
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </MainWrapper>
  );
}
