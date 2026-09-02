import { cookies } from "next/headers";
import { onFetchProjectDetails } from "../(project details)/page";
import EditProjectInfoForm from "@/components/dashboard/project/edit-project-info-form";
import api from "@/lib/axios";

const onPatchProjectInfo: (data: {
  id: string | number;
  code?: string | number;
  project_name?: string;
}) => Promise<{ ok: boolean; message?: string }> = async ({
  id,
  code,
  project_name,
}) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    let subData;

    if (code) {
      subData = {
        code: code,
        project_name: project_name,
      };
    } else {
      subData = {
        project_name: project_name,
      };
    }

    await api.patch(`/a/job-ref/${id}/`, subData, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return { ok: true };
  } catch (error: any) {
    console.error(error, error.response.data);
    try {
      return { ok: false, message: error.response.data.code[0] };
    } catch {
      return { ok: false };
    }
  }
};

export default async function EditProjectInfoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  const project = await onFetchProjectDetails(projectId);

  return (
    <EditProjectInfoForm
      project={project}
      onPatchProjectInfo={onPatchProjectInfo}
    />
  );
}
