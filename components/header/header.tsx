"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { useAuthStore } from "@/stores/authstore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import { NotificationBell } from "./notification";

export const Header = () => {
  //   const router = useRouter();
  const { user, logout } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full h-20 z-50 py-4 transition-all duration-300 bg-transparent ",
          isScrolled && "bg-[rgba(245,245,245,0.1)] shadow-md backdrop-blur-sm"
        )}
      >
        <div
          className={cn(
            "flex justify-between max-w-[95%] mx-auto px-5 py-2 border border-[#F4EDED] rounded",
            isScrolled && "border-none"
          )}
        >
          {/* Logo or Title */}
          <Link href="/all-tasks" className="flex gap-2 items-center">
            <Image src="/logo.svg" alt="logo" height={20} width={20} />
            <p className="text-[#001633] dark:text-blue-300 md:text-2xl font-bold">
              To-Do
            </p>
          </Link>

          <div className="flex items-center gap-4">
            {/* the notification bell */}
            <NotificationBell />

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">
                      {user?.email || "—"}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
