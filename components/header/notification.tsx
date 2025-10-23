import { Bell, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/stores/useNotificationstore";

export function NotificationBell() {
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer border rounded-full p-1.5">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAll}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-gray-500 text-sm">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex justify-between items-center text-sm ${
                n.type === "error" ? "text-red-600" : "text-green-600"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <span>{n.message}</span>
              {n.action && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent closing the dropdown
                    n.action?.();
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
