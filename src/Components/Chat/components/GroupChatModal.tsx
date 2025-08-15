import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import Modal from "../../Modal";
import ProfileName from "../../ProfileName";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onCreateGroup: (selectedUsers: User[], groupName: string) => void;
  isLoading?: boolean;
}

const GroupChatModal = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onCreateGroup,
  isLoading = false,
}: GroupChatModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers([]);
      setGroupName("");
      setSearchTerm("");
    }
  }, [isOpen]);

  // Filter users excluding current user and based on search
  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUserId &&
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUserToggle = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length > 0 && groupName.trim()) {
      onCreateGroup(selectedUsers, groupName.trim());
    }
  };

  const capitalizeName = (name?: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const isCreateDisabled =
    selectedUsers.length === 0 || !groupName.trim() || isLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-2 sm:mx-4 max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Create Group Chat
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Icon
              icon="mdi:close"
              width="20"
              height="20"
              className="text-gray-500"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 sm:p-6 pb-1">
            {/* Group Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full h-10 px-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={50}
              />
            </div>

            {/* Search Input */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Members ({selectedUsers.length} selected)
              </label>
              <div className="relative">
                <Icon
                  icon="mynaui:search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members..."
                  className="w-full h-10 pl-10 pr-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Selected Users Preview */}
            {selectedUsers.length > 0 && (
              <div className="mb-2">
                <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm border border-primary/20 whitespace-nowrap flex-shrink-0"
                    >
                      <span className="font-medium">
                        {capitalizeName(user.firstName)}{" "}
                        {capitalizeName(user.lastName)}
                      </span>
                      <button
                        onClick={() => handleUserToggle(user)}
                        className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer transition-colors"
                      >
                        <Icon
                          icon="mdi:close"
                          width="10"
                          height="10"
                          className="sm:w-3 sm:h-3"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Users List */}
          <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4">
            <div className="max-h-48 sm:max-h-60 overflow-y-auto hide-scrollbar">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-2">
                  {searchTerm
                    ? "No members found matching your search."
                    : "No members available."}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id
                    );
                    const fullName = `${capitalizeName(
                      user.firstName
                    )} ${capitalizeName(user.lastName)}`;

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-primary/10 border border-primary/30 shadow-sm"
                            : "hover:bg-gray-50 border border-transparent hover:shadow-sm"
                        }`}
                        onClick={() => handleUserToggle(user)}
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-gray-300 bg-white hover:border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <Icon
                                icon="mdi:check"
                                width="10"
                                height="10"
                                className="text-white sm:w-3 sm:h-3"
                              />
                            )}
                          </div>
                        </div>

                        <ProfileName name={fullName} />

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm sm:text-[15px]">
                            {fullName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 px-4 sm:px-5 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors cursor-pointer hover:bg-gray-100 rounded-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={isCreateDisabled}
            className={`order-1 sm:order-2 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-md font-medium transition-all text-sm sm:text-base ${
              isCreateDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-red-700 text-white cursor-pointer shadow-sm hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <Icon
                  icon="svg-spinners:ring-resize"
                  width="14"
                  height="14"
                  className="sm:w-4 sm:h-4"
                />
                <span className="hidden sm:inline">Creating...</span>
                <span className="sm:hidden">Creating</span>
              </>
            ) : (
              <>
                <Icon
                  icon="ic:round-plus"
                  width="14"
                  height="14"
                  className="sm:w-4 sm:h-4"
                />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupChatModal;
