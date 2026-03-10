import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";

interface User {
  _id: string;
  [key: string]: unknown;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  isOptimistic?: boolean;
}

interface MessageData {
  text?: string;
  image?: string;
}

interface ChatStore {
  allContacts: User[];
  chats: User[];
  messages: Message[];
  activeTab: string;
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedUser: (selectedUser: User | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void> ;
  sendMessage: (messageData: MessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") ?? "false") === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/chats");
      set({ chats: res.data });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ messages });
      toast.error(err.response?.data?.message ?? "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      if (newMessage.senderId !== selectedUser._id) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e: Error) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));