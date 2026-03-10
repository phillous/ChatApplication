import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div
      style={{
        display: "flex",
        margin: "12px 16px",
        background: "#f0f0f7",
        borderRadius: "12px",
        padding: "4px",
        gap: "2px",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {(["chats", "contacts"] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "13.5px",
              fontWeight: isActive ? 600 : 500,
              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              letterSpacing: "-0.01em",
              transition: "all 0.18s ease",
              background: isActive
                ? "white"
                : "transparent",
              color: isActive ? "#6c63ff" : "#9ca3af",
              boxShadow: isActive
                ? "0 1px 4px rgba(108, 99, 255, 0.15), 0 1px 2px rgba(0,0,0,0.08)"
                : "none",
              textTransform: "capitalize",
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "#6c63ff";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.06)";
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default ActiveTabSwitch;