import { useState } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    setNotifications(n => [msg, ...n]);
  };

  return { notifications, addNotification };
}