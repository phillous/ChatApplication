import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(108,99,255,0.06) 100%)",
          border: "2px solid rgba(108,99,255,0.18)",
          boxShadow: "0 4px 16px rgba(108,99,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MessageCircleIcon size={28} color="#6c63ff" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div>
        <h4
          style={{
            margin: "0 0 6px",
            fontSize: "15px",
            fontWeight: 600,
            color: "white",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          No conversations yet
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#9ca3af",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            lineHeight: 1.6,
            maxWidth: "220px",
          }}
        >
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>

      {/* CTA button */}
      <button
        onClick={() => setActiveTab("contacts")}
        style={{
          padding: "8px 18px",
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          color: "white",
          background: "rgba(108,99,255,0.08)",
          border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.18s ease",
          letterSpacing: "-0.01em",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.15)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(108,99,255,0.15)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        Find contacts
      </button>
    </div>
  );
}

export default NoChatsFound;