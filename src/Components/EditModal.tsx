import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface EditModalProps {
  visible: boolean;
  message: any;
  onSave: (messageId: string, newContent: string) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  message,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (message?.content) {
      setEditText(message.content);
    }
  }, [message]);

  if (!visible || !message) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 400,
          boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Edit Message</h3>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 16,
            resize: "vertical",
          }}
          placeholder="Edit your message..."
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#f2f2f2",
              color: "#23272a",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#93221D",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => onSave(message._id, editText)}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditModal;
