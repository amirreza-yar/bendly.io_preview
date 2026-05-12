import MainWrapper from "@/components/main-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

const content =
  "##### Bendly Privacy Policy";

export default function PrivacyPolicyPage() {
  return (
    <MainWrapper title="Privacy Policy" returnHref="/dashboard/setting">
      <ScrollArea className="h-full">
        <div className="terms-typography p-4 md:p-6">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </MainWrapper>
  );
}
