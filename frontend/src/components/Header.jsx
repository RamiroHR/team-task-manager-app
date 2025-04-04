export default function Header({ isAuthenticated, onLogout}) {
  return (
    <div className={`flex justify-between items-center pt-4 mb-4 ${!isAuthenticated? 'max-w-md mx-auto' : ''}`}>
      <h1 className="text-2xl font-bold">Task Manager</h1>
      {isAuthenticated && (
        <button
          onClick={onLogout}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
}
