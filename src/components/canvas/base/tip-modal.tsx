import { CircleQuestion, IconComponent } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";

export default function BaseTipModal({
  Icon,
  title,
  description,
  videoSrc,
}: {
  Icon: IconComponent | LucideIcon;
  title: string;
  description: string;
  videoSrc: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="bg-background rounded-lg shadow-md"
        >
          <CircleQuestion className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-blue-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-normal flex items-center gap-2 [&_svg]:size-5">
            <Icon />
            {title}
          </DialogTitle>
          <DialogDescription className="text-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <video autoPlay loop muted playsInline className="w-full h-auto">
            <source src={videoSrc} type="video/mp4" />
          </video>
          <DialogClose asChild>
            <Button className="self-end">Got it!</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
