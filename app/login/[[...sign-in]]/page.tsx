import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back to MEDIBOT
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to access your health companion
          </p>
        </div>
        <SignIn 
          routing="path"
          path="/login"
          signUpUrl="/register"
          appearance={{
            elements: {
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              card: "shadow-xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
            }
          }}
        />
      </div>
    </div>
  )
}