import { CredentialsLoginForm } from "../credentials"

export default function CredentialsLoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to continue
          </p>
        </div>
        <CredentialsLoginForm />
      </div>
    </div>
  )
} 