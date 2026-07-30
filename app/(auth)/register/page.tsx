import { RegisterForm } from "@/modules/auth/RegisterForm";

export const metadata = { title: "Join" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
        Join KindredFund
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Create an account as a supporter or creator.
      </p>
      <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
