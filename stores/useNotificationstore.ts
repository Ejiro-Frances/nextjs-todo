import { create } from "zustand";
import { v4 as uuid } from "uuid";

export type Notification = {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  action?: () => void;
  read: boolean;
};

type NotificationState = {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { id: uuid(), read: false, ...n },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAll: () => set({ notifications: [] }),
}));
