"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { loginSchema, LoginFormData } from "@/schemas/authschema";
import { login } from "@/services/authservice";
import { useAuthStore } from "@/stores/authstore";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      router.push("/all-tasks");
      toast.success(`Welcome back, ${data.user.name}!`);
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      console.log("user", data.user);
      console.log("acc", data.accessToken);
      console.log("ref", data.refreshToken);
      reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please check your credentials.";
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const submit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-primary text-3xl font-bold">Welcome Back</h1>
        <p className="text-sm text-gray-500">
          Login to continue managing your todos
        </p>
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input
          type="email"
          className="w-full"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <Input
          type="password"
          className="w-full"
          {...register("password")}
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mt-10">
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-10"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
