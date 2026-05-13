import { AdminDashboard } from "./admin-dashboard";

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <AdminDashboard
      defaultSearch={params.search ?? ""}
      defaultPage={params.page ?? "1"}
      defaultLimit={params.limit ?? "5"}
    />
  );
}
