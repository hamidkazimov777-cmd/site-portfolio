import { PasswordLoginForm } from "@/components/password-login-form";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function ControlLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-accent">
          /control
        </p>
        <h1 className="mt-3 text-center text-2xl font-medium text-foreground">
          Admin sign in
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the admin password to manage your site.
        </p>
        <div className="mt-8">
          <PasswordLoginForm />
        </div>
      </div>
    </div>
  );
}
