import React from "react";
import { Icon } from "@iconify/react";
import ReactDOM from "react-dom";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  message: any;
  onEdit: (message: any) => void;
  onDelete: (message: any) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  message,
  onEdit,
  onDelete,
  onClose,
}) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      id="custom-context-menu"
      className="custom-context-menu-anim custom-context-menu-light"
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 9999,
        transition:
          "opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="custom-context-menu-item"
        onClick={() => {
          if (message?._id && message?.content) {
            onEdit(message);
          }
          onClose();
        }}
      >
        <span className="custom-context-menu-icon">
          <Icon icon="mdi:pencil-outline" />
        </span>
        Edit message
      </button>
      <button
        className="custom-context-menu-item"
        onClick={() => {
          onDelete(message);
          onClose();
        }}
      >
        <span className="custom-context-menu-icon">
          <Icon icon="mdi:trash-can-outline" />
        </span>
        Delete
      </button>
    </div>,
    document.body
  );
};

export default ContextMenu;
