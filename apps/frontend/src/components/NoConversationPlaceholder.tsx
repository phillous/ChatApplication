import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: "24px",
        background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
      }}
    >
      {/* Icon ring */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(108,99,255,0.06) 100%)",
          border: "2px solid rgba(108,99,255,0.2)",
          boxShadow: "0 4px 20px rgba(108,99,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <MessageCircleIcon size={36} color="#6c63ff" strokeWidth={1.5} />
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "18px",
          fontWeight: 600,
          color: "#1a1a2e",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Select a conversation
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: "13.5px",
          color: "#9ca3af",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          lineHeight: 1.6,
          maxWidth: "260px",
          fontWeight: 400,
        }}
      >
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;