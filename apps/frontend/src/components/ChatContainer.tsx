import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages: { date: string; msgs: typeof messages }[] = [];
  messages.forEach((msg) => {
    const dateLabel = new Date(msg.createdAt).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateLabel) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateLabel, msgs: [msg] });
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} className="bg-blue-900">
      <ChatHeader />

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          background: "linear-gradient(180deg, #0d1b2a 0%, #112240 100%)",
          scrollbarWidth: "thin",
          scrollbarColor: "#1e3a5f transparent",
        }}
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName as string} />
        ) : (
          <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2px" }}>
            {groupedMessages.map(({ date, msgs }) => (
              <div key={date}>
                {/* Date divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "20px 0 14px",
                  }}
                >
                  <div style={{ flex: 1, height: "1px", background: "#1e3a5f" }} />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#c4b5fd",
                      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {date}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "#1e3a5f" }} />
                </div>

                {/* Messages in this group */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {msgs.map((msg) => {
                    const isMine = msg.senderId === authUser?._id;
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "68%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMine ? "flex-end" : "flex-start",
                            gap: "3px",
                          }}
                        >
                          {/* Bubble */}
                          <div
                            style={{
                              padding: msg.image && !msg.text ? "4px" : "10px 14px",
                              borderRadius: isMine
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                              background: isMine
                                ? "linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%)"
                                : "#163156",
                              color: isMine ? "white" : "#cfe2f3",
                              boxShadow: isMine
                                ? "0 2px 8px rgba(108,99,255,0.25)"
                                : "0 1px 3px rgba(0,0,0,0.4)",
                              border: isMine ? "none" : "1px solid #1e3a5f",
                              transition: "transform 0.1s ease",
                            }}
                          >
                            {msg.image && (
                              <img
                                src={msg.image}
                                alt="Shared"
                                style={{
                                  borderRadius: "12px",
                                  maxHeight: "220px",
                                  objectFit: "cover",
                                  display: "block",
                                  maxWidth: "100%",
                                }}
                              />
                            )}
                            {msg.text && (
                              <p
                                style={{
                                  margin: msg.image ? "8px 4px 4px" : 0,
                                  fontSize: "14px",
                                  lineHeight: 1.5,
                                  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                                  wordBreak: "break-word",
                                }}
                              >
                                {msg.text}
                              </p>
                            )}
                          </div>

                          {/* Timestamp */}
                          <span
                            style={{
                              fontSize: "10.5px",
                              color: "#4a7fa5",
                              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                              fontWeight: 500,
                              paddingLeft: isMine ? 0 : "4px",
                              paddingRight: isMine ? "4px" : 0,
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;