import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Create account: SkillMap" };

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Sign up as a student, it takes less than a minute."
    >
      <SignupForm />
    </AuthShell>
  );
}
