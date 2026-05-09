import { cookies } from "next/headers";
import api from "@/lib/axios";
import { Project } from "@/types/api";
import NewProjectForm from "@/components/dashboard/project/new-project-form";

export const onPostNewProject: (data: {
  code: string;
  project_name?: string;
  title: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  name: string;
  phone: string;
}) => Promise<{ ok: boolean; message?: string; data?: Project }> = async ({
  code,
  project_name,
  title,
  street,
  suburb,
  state,
  postcode,
  name,
  phone,
}) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const postData = {
      code: code,
      project_name: project_name ?? "No project name assigned",
      addresses: [
        {
          title: title,
          street_address: street,
          suburb: suburb,
          state: state,
          postcode: postcode,
          recipient_name: name,
          recipient_phone: phone,
        },
      ],
    };

    const res = await api.post(`/a/job-ref/`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data as Project };
  } catch (error: any) {
    console.error(error, error.response.data);
    try {
      return { ok: false, message: error.response.data.code[0] };
    } catch {
      return { ok: false };
    }
  }
};

export default async function NewAddressPage() {
  return <NewProjectForm onPostNewProject={onPostNewProject} />;
}
