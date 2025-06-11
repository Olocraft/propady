import { AuthProvider } from "@/context/AuthContext";
import { getClient } from "@/db/db";

export default async function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AuthProvider session={session}>{children}</AuthProvider>;
}
