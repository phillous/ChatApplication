import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { toast } from "sonner";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ text: text.trim(), image: imagePreview ?? undefined });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSend = text.trim() || imagePreview;

  return (
    <div
      style={{
        padding: "12px 16px 16px",
        borderTop: "1px solid #e8e8ed",
        background: "white",
      }}
    >
      {/* Image preview */}
      {imagePreview && (
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "72px",
                height: "72px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid rgba(108,99,255,0.25)",
                display: "block",
              }}
            />
            <button
              onClick={removeImage}
              type="button"
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#6c63ff",
                border: "2px solid white",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                boxShadow: "0 2px 6px rgba(108,99,255,0.3)",
              }}
            >
              <XIcon size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={handleSendMessage}
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#f4f4f9",
          border: "1.5px solid #e8e8ed",
          borderRadius: "16px",
          padding: "6px 6px 6px 16px",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        }}
        onFocus={e => {
          (e.currentTarget as HTMLFormElement).style.borderColor = "rgba(108,99,255,0.4)";
          (e.currentTarget as HTMLFormElement).style.boxShadow = "0 0 0 3px rgba(108,99,255,0.08)";
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            (e.currentTarget as HTMLFormElement).style.borderColor = "#e8e8ed";
            (e.currentTarget as HTMLFormElement).style.boxShadow = "none";
          }
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
          placeholder="Type a message…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            color: "#1a1a2e",
            padding: "6px 0",
            caretColor: "#6c63ff",
          }}
        />

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Image attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            background: imagePreview ? "rgba(108,99,255,0.1)" : "transparent",
            color: imagePreview ? "#6c63ff" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.18s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "#6c63ff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = imagePreview ? "rgba(108,99,255,0.1)" : "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = imagePreview ? "#6c63ff" : "#9ca3af";
          }}
        >
          <ImageIcon size={17} />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          title="Send message"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            background: canSend
              ? "linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%)"
              : "#f0f0f7",
            color: canSend ? "white" : "#c4b5fd",
            cursor: canSend ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.18s ease",
            boxShadow: canSend ? "0 2px 8px rgba(108,99,255,0.3)" : "none",
          }}
        >
          <SendIcon size={16} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;