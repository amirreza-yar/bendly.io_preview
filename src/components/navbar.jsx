import { Bold, Hand } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export function BottomNavbar(event) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16">
      <div className="flex h-full -lg  mx-auto items-center gap-4">
        <Toggle aria-label="Toggle" onclick={event}>
          <Hand className="h-4 w-4" />
          Pan
        </Toggle>
      </div>
    </div>
  );
}
