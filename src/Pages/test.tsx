// UserDropdown.tsx

const UserDropdown: React.FC = () => {
  return (
    <div className="group relative inline-block">
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Hover me
      </button>

      <div className="absolute left-0 mt-2 hidden group-hover:block bg-gray-100 p-2 rounded shadow">
        <p className="text-sm">Hello! I appear on hover 👋</p>
      </div>
    </div>
  );
};

export default UserDropdown;
