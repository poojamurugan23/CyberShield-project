import { useEffect } from "react";
import io from "socket.io-client";

export default function useSocket(dispatch) {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("notification", (msg) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: msg });
    });

  }, []);
}