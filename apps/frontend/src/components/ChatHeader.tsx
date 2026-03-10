import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);
  if (!selectedUser) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1e3a5f",
        maxHeight: "84px",
        padding: "0 24px",
        flex: 1,
      }}
      className="bg-blue-700"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.profilePic as string || "/avatar.png"} alt={selectedUser.fullName as string} />
          </div>
        </div>
        <div>
          <h3 style={{ color: "#cfe2f3", fontWeight: 500 }}>{selectedUser.fullName as string}</h3>
          <p style={{ color: "#4a7fa5", fontSize: "14px" }}>{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon style={{ width: "20px", height: "20px", color: "#4a7fa5", cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#cfe2f3")}
          onMouseLeave={e => (e.currentTarget.style.color = "#4a7fa5")}
        />
      </button>
    </div>
  );
}
export default ChatHeader;