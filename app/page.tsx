"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button";

import SignupForm from "@/components/auth/signupform";
import LoginForm from "@/components/auth/loginform";

export default function AuthPage() {
  useAuthGuard({ requireAuth: false });
  const [activeTab, setActiveTab] = useState("login");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md min-h-[470px] bg-white rounded-2xl shadow-md px-8 py-4">
        <div className="grid grid-cols-2 mb-6 bg-gray-200 p-1 rounded-md">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("login")}
            className={`${
              activeTab === "login"
                ? "bg-primary hover:bg-primary text-white"
                : ""
            }`}
          >
            Login
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("signup")}
            className={`${
              activeTab === "signup"
                ? "bg-primary hover:bg-primary text-white"
                : ""
            }`}
          >
            Sign Up
          </Button>
        </div>

        {activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </main>
  );
}
