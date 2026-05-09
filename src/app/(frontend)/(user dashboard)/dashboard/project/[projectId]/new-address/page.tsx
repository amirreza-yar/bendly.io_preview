import { cookies } from "next/headers";
import { onFetchProjectDetails } from "../(project details)/page";
import EditProjectInfoForm from "@/components/dashboard/project/edit-project-info-form";
import api from "@/lib/axios";
import NewAddressForm from "@/components/dashboard/project/new-project-address-form";

const onPostNewAddress: (data: {
  id: string | number;
  title: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  name: string;
  phone: string;
}) => Promise<{ ok: boolean; message?: string }> = async ({
  id,
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

    await api.post(
      `/a/job-ref/${id}/address/`,
      {
        title: title,
        street_address: street,
        suburb: suburb,
        state: state,
        postcode: postcode,
        recipient_name: name,
        recipient_phone: phone,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    try {
      return { ok: false, message: error.response.data.code[0] };
    } catch {
      return { ok: false };
    }
  }
};

export default async function NewAddressPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  return (
    <NewAddressForm projectId={projectId} onPostNewAddress={onPostNewAddress} />
  );
}
