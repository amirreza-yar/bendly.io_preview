import { cookies } from "next/headers";
import api from "@/lib/axios";
import NewAddressForm from "@/components/dashboard/project/new-project-address-form";
import { Address } from "@/types/api";

const onPostNewAddress: (data: {
  id: string | number;
  title: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  name: string;
  phone: string;
}) => Promise<{ data?: Address; ok: boolean; message?: string }> = async ({
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

    const res = await api.post(
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

    return { ok: true, data: res.data };
  } catch (error: any) {
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
