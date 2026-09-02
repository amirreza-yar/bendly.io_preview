import MainWrapper from "@/components/main-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";

const onFetchPrivacyPolicy: () => Promise<{
  content_type: string;
  content_type_display: string;
  content: string;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/static-content/privacy_policy/", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(error, error?.response?.data);

    return {};
  }
};

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await onFetchPrivacyPolicy()
  
  return (
    <MainWrapper title="Privacy Policy" returnHref="/dashboard/setting">
      <ScrollArea className="h-full">
        <div className="terms-typography p-4 md:p-6">
          <ReactMarkdown>{privacyPolicy.content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </MainWrapper>
  );
}
