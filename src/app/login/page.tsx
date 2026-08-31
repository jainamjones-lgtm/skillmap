import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Log in: SkillMap" };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to SkillMap"
      subtitle="Pick up where you left off and keep your streak alive."
    >
      <LoginForm />
    </AuthShell>
  );
}
