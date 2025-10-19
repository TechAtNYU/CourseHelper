import { LoginForm } from "@/app/sign-in/components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-muted relative flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
