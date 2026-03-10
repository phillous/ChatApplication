import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:3001" 

interface AuthUser {
  _id: string;
  [key: string]: unknown;
}

interface SignupData {
  [key: string]: unknown;
}

interface LoginData {
  [key: string]: string | number
}

interface UpdateProfileData {
  [key: string]: unknown;
}

interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  socket: Socket | null;
  onlineUsers: string[];
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

type ApiError = { response?: { data?: { message?: string } } };

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    console.log(axiosInstance.defaults.baseURL);
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.delete("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    try {
      const res = await axiosInstance.put<AuthUser>("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const err = error as ApiError;
      console.log("Error in update profile:", error);
      toast.error(err.response?.data?.message ?? "Something went wrong");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    console.log("Connecting to socket user:", authUser.fullName );

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

    console.log("Socket:", socket)
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));