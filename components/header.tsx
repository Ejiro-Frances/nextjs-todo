"use client";

// import { useRouter } from "next/navigation";
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

export const Header = () => {
  //   const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b bg-white sticky top-0 z-10">
      {/* Logo or Title */}
      <h1 className="text-2xl font-bold text-primary">Task Manager</h1>

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
              <p className="text-sm text-gray-500">{user?.email || "—"}</p>
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
    </header>
  );
};

export default Header;
