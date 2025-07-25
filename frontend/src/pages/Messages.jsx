import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { FaUser, FaCircle } from "react-icons/fa";
import io from "socket.io-client";

const Messages = () => {
    const { currentUser } = useUser();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    // Configure axios with auth token
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    // Fetch all conversations
    const fetchConversations = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/messages/conversations",
                axiosConfig
            );
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setLoading(false);
        }
    };

    // Fetch messages for selected conversation
    const fetchMessages = async (postId, otherUserId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/messages/conversation/${postId}/${otherUserId}`,
                axiosConfig
            );
            setMessages(response.data);

            // Mark messages as read
            await axios.put(
                `http://localhost:5000/api/messages/read/${postId}/${otherUserId}`,
                {},
                axiosConfig
            );
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Send a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const messageData = {
                recipientId: selectedConversation.otherUser._id,
                postId: selectedConversation.postId._id,
                content: newMessage.trim(),
                conversationId: `${selectedConversation.postId._id}_${selectedConversation.otherUser._id}`,
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
            // Refresh messages and conversations
            fetchMessages(
                selectedConversation.postId._id,
                selectedConversation.otherUser._id
            );
            fetchConversations();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Initial fetch of conversations
    useEffect(() => {
        fetchConversations();
    }, []);

    // Set up socket connection and event listeners
    useEffect(() => {
        if (selectedConversation) {
            // Connect to socket
            socketRef.current = io("http://localhost:5000");

            // Join conversation
            const conversationId = `${selectedConversation.postId._id}_${selectedConversation.otherUser._id}`;
            socketRef.current.emit("joinConversation", conversationId);

            // Listen for new messages
            socketRef.current.on("receiveMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [selectedConversation]);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Conversations List */}
                <div className="bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-200px)] overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="text-gray-500 text-center">No conversations yet</p>
                    ) : (
                        conversations.map((conversation) => (
                            <button
                                key={`${conversation.postId._id}_${conversation.otherUser._id}`}
                                onClick={() => {
                                    setSelectedConversation(conversation);
                                    fetchMessages(
                                        conversation.postId._id,
                                        conversation.otherUser._id
                                    );
                                }}
                                className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-50 transition-colors ${
                                    selectedConversation?.postId._id ===
                                        conversation.postId._id &&
                                    selectedConversation?.otherUser._id ===
                                        conversation.otherUser._id
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {conversation.otherUser.profilePic ? (
                                            <img
                                                src={conversation.otherUser.profilePic}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {conversation.otherUser.firstName}{" "}
                                            {conversation.otherUser.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {conversation.postId.bookName}
                                        </p>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <FaCircle className="text-blue-500 text-xs" />
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Messages Area */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-200px)] flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Conversation Header */}
                            <div className="border-b pb-4 mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {selectedConversation.otherUser.profilePic ? (
                                            <img
                                                src={selectedConversation.otherUser.profilePic}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-medium">
                                            {selectedConversation.otherUser.firstName}{" "}
                                            {selectedConversation.otherUser.lastName}
                                        </h2>
                                        <Link
                                            to={`/posts/${selectedConversation.postId._id}`}
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            View Book: {selectedConversation.postId.bookName}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
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

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
