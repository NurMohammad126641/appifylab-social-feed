import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUserId } from "@/lib/auth";

export default async function RegisterPage() {
  const userId = await getSessionUserId();

  if (userId) {
    redirect("/feed");
  }

  return (
    <AuthShell
      variant="registration"
      title="Registration"
      subtitle="Get Started Now"
      googleText="Register with google"
      footerText="Already have an account?"
      footerLinkLabel="Login"
      footerHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
