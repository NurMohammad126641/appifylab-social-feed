import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUserId } from "@/lib/auth";

export default async function LoginPage() {
  const userId = await getSessionUserId();

  if (userId) {
    redirect("/feed");
  }

  return (
    <AuthShell
      variant="login"
      title="Login to your account"
      subtitle="Welcome back"
      googleText="Or sign-in with google"
      footerText="Dont have an account?"
      footerLinkLabel="Create New Account"
      footerHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
