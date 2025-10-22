"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signupSchema, SignupFormData } from "@/schemas/authschema";
import { Signup } from "@/services/authservice";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/authstore";
import axios from "axios";
import { da } from "zod/v4/locales";

export const SignupForm = () => {
  const { setAccessToken, setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutate = useMutation({
    mutationFn: Signup,
    onSuccess: (data) => {
      toast.success(`Welcome, ${data.user.name}!`);
      setUser(data.user);
      setAccessToken(data.accessToken);
      console.log(data.accessToken);

      router.push("/tasks");
      reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Signup failed. Please try again.";
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const submit = (data: SignupFormData) => {
    signupMutate.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-primary text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-gray-500">
          Join us and start organizing your todos
        </p>
      </div>

      <div>
        <label className="block text-sm mb-1">Full Name</label>
        <Input
          type="text"
          className="w-full"
          placeholder="John Doe"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input
          type="email"
          className="w-full"
          placeholder="you@example.com"
          {...register("email")}
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
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mt-7">
        <Button
          type="submit"
          className="w-full"
          disabled={signupMutate.isPending}
        >
          {" "}
          {signupMutate.isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
