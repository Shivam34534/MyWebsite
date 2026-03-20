import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "../mockClerk"; // From our custom Auth setup
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user, isSignedIn } = useUser(); // Using real user state from AuthContext
    const { getToken } = useAuth(); // Just in case, but user._id is main logic

    useEffect(() => {
        if (isSignedIn && user?.id) {
            // Initiate Socket connecting to backend server URL
            const socketInstance = io(import.meta.env.VITE_BASEURL, {
                query: {
                    userId: user.id
                }
            });

            setSocket(socketInstance);

            // Listen for online users array updates
            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => {
                socketInstance.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isSignedIn, user?.id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
