import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";

const MessageBox = ({ postId, postOwner }) => {
    const { currentUser } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);

    // Configure axios with auth token
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    // Fetch existing messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/messages/conversation/${postId}/${postOwner._id}`,
                axiosConfig
            );
            setMessages(response.data);
            // Mark messages as read
            if (response.data.length > 0) {
                await axios.put(
                    `http://localhost:5000/api/messages/read/${postId}/${postOwner._id}`,
                    {},
                    axiosConfig
                );
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (postId && postOwner) {
            fetchMessages();

            // Connect to socket
            socketRef.current = io("http://localhost:5000");

            // Join conversation
            const conversationId = `${postId}_${postOwner._id}`;
            socketRef.current.emit("joinConversation", conversationId);

            // Listen for new messages
            socketRef.current.on("receiveMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [postId, postOwner]);

    const [error, setError] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        setError(""); // Clear any previous errors
        try {
            const messageData = {
                recipientId: postOwner._id,
                postId,
                content: newMessage.trim(),
                conversationId: `${postId}_${postOwner._id}`,
                sender: {
                    _id: currentUser._id,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    profilePic: currentUser.profilePic
                }
            };

            await axios.post(
                "http://localhost:5000/api/messages/send",
                messageData,
                axiosConfig
            );

            socketRef.current.emit("sendMessage", messageData);

            setNewMessage("");
            fetchMessages(); // Refresh messages
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to send message. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || !postOwner || currentUser._id === postOwner._id)
        return null;

    return (
        <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Message the Owner</h3>

            {/* Messages container */}
            <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${
                            message.sender._id === currentUser._id
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender._id === currentUser._id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-75 block mt-1">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input form */}
            {error && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FaPaperPlane className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default MessageBox;
