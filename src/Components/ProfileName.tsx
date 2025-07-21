import React from "react";

interface ProfileNameProps {
  name: string;
  online?: boolean;
}

function getInitials(name: string) {
  if (!name || typeof name !== "string" || name.trim() === "") return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return (parts[0][0] || "?").toUpperCase();
  }
  return (
    (parts[0][0] || "").toUpperCase() +
    (parts[parts.length - 1][0] || "").toUpperCase()
  );
}

function getColorFromName(name: string) {
  const colors = ["#AEC6CF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

const ProfileName: React.FC<ProfileNameProps> = ({ name, online }) => {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 600,
          fontSize: 22,
          userSelect: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {initials}
      </div>
      {online && (
        <span
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#00D26A",
            border: "2px solid white",
            display: "block",
          }}
        />
      )}
    </div>
  );
};

export default ProfileName;
