import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 10px 10px" }}>
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id;

        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: isSelected
                ? "linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(108,99,255,0.06) 100%)"
                : "transparent",
              border: isSelected
                ? "1px solid rgba(108,99,255,0.2)"
                : "1px solid transparent",
              boxShadow: isSelected ? "0 1px 4px rgba(108,99,255,0.1)" : "none",
            }}
            onMouseEnter={e => {
              if (!isSelected) {
                (e.currentTarget as HTMLDivElement).style.background = "#f5f5fb";
                (e.currentTarget as HTMLDivElement).style.border = "1px solid #e8e8ed";
              }
            }}
            onMouseLeave={e => {
              if (!isSelected) {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.border = "1px solid transparent";
              }
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={(contact.profilePic as string) || "/avatar.png"}
                alt={contact.fullName as string}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: isSelected ? "2px solid #6c63ff" : "2px solid #e8e8ed",
                  transition: "border-color 0.18s ease",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isOnline ? "#22c55e" : "#d1d5db",
                  border: "2px solid white",
                  boxShadow: isOnline ? "0 0 4px rgba(34,197,94,0.5)" : "none",
                  transition: "background 0.2s ease",
                }}
              />
            </div>

            {/* Name + status */}
            <div style={{ overflow: "hidden", flex: 1 }}>
              <h4
                style={{
                  margin: 0,
                  color: isSelected ? "#6c63ff" : "#1a1a2e",
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: "14px",
                  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "color 0.18s ease",
                }}
              >
                {contact.fullName as string}
              </h4>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "11.5px",
                  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                  fontWeight: 500,
                  color: isOnline ? "#22c55e" : "#c4b5fd",
                  letterSpacing: "0.01em",
                  transition: "color 0.18s ease",
                }}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;