import { SquareLoader } from "@/components/ui/loader";

export default function BaseLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SquareLoader />
    </div>
  );
}
