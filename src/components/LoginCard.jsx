import React from 'react'
import { GoogleLogin } from "@react-oauth/google"
function LoginCard() {
  return (
    <div className="w-full max-w-md mx-auto">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

              <div className="space-y-6">
                  <div  className="flex justify-center">
                  <GoogleLogin
            //   onSuccess={handleLoginSuccess}
              onError={() => toast.error("Google Login failed!")}
              theme="filled_black"
              size="large"
              text="continue_with"
              width="250"
            />
                  </div>

        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Secure authentication
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LoginCard