import { cookies } from "next/headers";
import api from "@/lib/axios";
import EditAddressForm from "@/components/dashboard/project/edit-project-address-form";
import { Address } from "@/types/api";
import { notFound } from "next/navigation";

const onPatchAddress: (data: {
  projectId: string | number;
  addressId: string | number;
  title: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  name: string;
  phone: string;
}) => Promise<{ ok: boolean; message?: string }> = async ({
  projectId,
  addressId,
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

    await api.patch(
      `/a/job-ref/${projectId}/address/${addressId}/`,
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
    try {
      return { ok: false, message: error.response.data.code[0] };
    } catch {
      return { ok: false };
    }
  }
};

const onFetchAddress: (data: {
  projectId: string | number;
  addressId: string | number;
}) => Promise<{ data?: Address; ok: boolean; message?: string }> = async ({
  projectId,
  addressId,
}) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(`/a/job-ref/${projectId}/address/${addressId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
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
  params: Promise<{ projectId: string; addressId: string }>;
}) {
  const projectId = (await params).projectId;
  const addressId = (await params).addressId;

  const address = await onFetchAddress({ projectId, addressId });

  if (!address || !address.data || !address.ok) return notFound();

  return (
    <EditAddressForm
      projectId={projectId}
      onPatchAddress={onPatchAddress}
      address={address.data}
    />
  );
}
