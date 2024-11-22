// Admin Page
import React, { useState, useEffect } from "react";

const AdminPage = () => {
    const [email, setEmail] = useState('');
    const [previousEmail, setPreviousEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userList, setUserList] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Fetch existing users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/users');
            const data = await response.json();
            setUserList(data.users);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleSubmit = async (action) => {
        setError(null);
        setSuccess(null);
        const apiUrl = action === 'add'
            ? 'http://localhost:3000/admin/add-user'
            : 'http://localhost:3000/admin/update-user';

        try {
            const body = action === 'add'
                ? { name, email, password, role }
                : { name, previousEmail, email, password, role };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.status !== 200) {
                setError(data.message);
            } else {
                setSuccess(`${action === 'add' ? "Added" : "Updated"} user successfully`);
                fetchUsers();
                resetForm();
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An unexpected error occurred.");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/delete-user/${userId}`, {
                method: 'DELETE',
            });
            if (response.status === 200) {
                setSuccess("Deleted user successfully");
                fetchUsers();
            } else {
                setError("Failed to delete user");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("An unexpected error occurred.");
        }
    };

    const startUpdate = (user) => {
        setIsUpdateMode(true);
        setPreviousEmail(user.email);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
    };

    const resetForm = () => {
        setEmail('');
        setPreviousEmail('');
        setPassword('');
        setName('');
        setRole('Student');
        setIsUpdateMode(false);
    };

    const handleLogout = () => {
        // Assuming you clear tokens or session storage for logout
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
                >
                    Logout
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
                {/* Left Side: Admin Form */}
                <div className="w-full md:w-96 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">User Management</h2>

                    <form className="space-y-4">
                        {isUpdateMode && (
                            <div>
                                <label htmlFor="previousEmail" className="block text-lg font-medium text-gray-700">Previous Email</label>
                                <input
                                    id="previousEmail"
                                    type="email"
                                    value={previousEmail}
                                    onChange={(e) => setPreviousEmail(e.target.value)}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-lg font-medium text-gray-700">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                            </select>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => handleSubmit(isUpdateMode ? 'update' : 'add')}
                                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                            >
                                {isUpdateMode ? "Update User" : "Add User"}
                            </button>
                            {isUpdateMode && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {error && (
                        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
                    )}
                    {success && (
                        <p className="mt-4 text-center text-green-500 font-medium">{success}</p>
                    )}
                </div>

                {/* Right Side: User List */}
                <div className="w-full md:w-7/12 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">User List</h3>
                    <div className="overflow-auto">
                        <ul className="space-y-4">
                            {userList.map(user => (
                                <li key={user._id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-all">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email} - <span className="font-medium">{user.role}</span></p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => startUpdate(user)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
