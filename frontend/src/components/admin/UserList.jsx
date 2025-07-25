import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setUsers(users.filter((user) => user._id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;