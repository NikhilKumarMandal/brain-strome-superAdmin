import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { login, logout, self } from "../http/api";
import { toast } from "sonner";
import { usePermission } from "../hooks/usePermission";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/store";

const loginUser = async (token) => {
  const { data } = await login(token);
  return data;
};

const getSelf = async () => {
  const { data } = await self().then((res) => res.data);
  return data;
};
function LoginCard() {
  const { setUser, logout: logoutUserFromStore } = useAuthStore();
  const { isAllowed } = usePermission();
  console.log(isAllowed);

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutUserFromStore();
      return;
    },
  });

  const handleLoginSuccess = (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) {
      return toast.error("Google token not found!");
    }
    AuthLogin(googleToken);
  };

  const { mutate: AuthLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch();
      console.log(selfDataPromise, "Self");

      if (!isAllowed(selfDataPromise.data)) {
        logoutMutate();
        return;
      }
      setUser(selfDataPromise.data);
    },
  });
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
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
  );
}

export default LoginCard;
