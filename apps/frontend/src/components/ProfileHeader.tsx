import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, CameraIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div
      style={{
        padding: "18px 20px",
        borderBottom: "1px solid #e8e8ed",
        boxShadow: "0 1px 0 0 rgba(0,0,0,0.06)",
      }}
      className="bg-blue-950"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* LEFT: Avatar + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2.5px solid #6c63ff",
                boxShadow: "0 0 0 3px rgba(108, 99, 255, 0.12)",
                cursor: "pointer",
                padding: 0,
                background: "none",
                position: "relative",
                transition: "box-shadow 0.2s ease",
                display: "block",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 4px rgba(108, 99, 255, 0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(108, 99, 255, 0.12)";
              }}
              className="avatar-btn"
            >
              <img
                src={selectedImg || (authUser?.profilePic as string) || "/avatar.png"}
                alt="User image"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Hover overlay */}
              <div
                className="avatar-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(108, 99, 255, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  borderRadius: "50%",
                }}
              >
                <CameraIcon size={16} color="white" />
              </div>
            </button>

            {/* Online dot */}
            <span
              style={{
                position: "absolute",
                bottom: "1px",
                right: "1px",
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid white",
                boxShadow: "0 0 4px rgba(34,197,94,0.5)",
              }}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Name + Status */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "-0.01em",
                maxWidth: "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                margin: 0,
                lineHeight: 1.3,
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              }}
            >
              {authUser?.fullName as string}
            </h3>
            <p
              style={{
                color: "#22c55e",
                fontSize: "11.5px",
                fontWeight: 500,
                margin: "2px 0 0",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              Active now
            </p>
          </div>
        </div>

        {/* RIGHT: Action buttons */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          
          {/* Sound toggle */}
          <button
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error: Error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            title={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid #e8e8ed",
              background: isSoundEnabled ? "rgba(108, 99, 255, 0.08)" : "white",
              color: isSoundEnabled ? "#6c63ff" : "#9ca3af",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.18s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "rgba(108, 99, 255, 0.12)";
              btn.style.borderColor = "#c4bfff";
              btn.style.color = "#6c63ff";
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = isSoundEnabled ? "rgba(108, 99, 255, 0.08)" : "white";
              btn.style.borderColor = "#e8e8ed";
              btn.style.color = isSoundEnabled ? "#6c63ff" : "#9ca3af";
            }}
          >
            {isSoundEnabled ? <Volume2Icon size={16} /> : <VolumeOffIcon size={16} />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            title="Sign out"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid #e8e8ed",
              background: "white",
              color: "#9ca3af",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.18s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "#fff1f2";
              btn.style.borderColor = "#fecdd3";
              btn.style.color = "#f43f5e";
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "white";
              btn.style.borderColor = "#e8e8ed";
              btn.style.color = "#9ca3af";
            }}
          >
            <LogOutIcon size={16} />
          </button>
        </div>
      </div>

      {/* CSS for hover overlay effect */}
      <style>{`
        .avatar-btn:hover .avatar-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default ProfileHeader;