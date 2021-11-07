import ReactNotification, { store } from "react-notifications-component";

import { useEffect } from "react";

import { useAppDispatch, useTypedSelector } from "../../app/store";
import {
  selectNotifications,
  removeNotification,
  Notification,
} from "./notificationsSlice";
import "react-notifications-component/dist/theme.css";

export function Notifications() {
  const notifications = useTypedSelector(selectNotifications);
  const timeout = 2000;
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach((notif: Notification) => {
      store.addNotification({
        id: notif.id,
        title: "Notification",
        message: notif.message,
        type: "info",
        insert: "bottom",
        container: "bottom-right",
        dismiss: {
          duration: timeout,
          pauseOnHover: true,
          onScreen: true,
        },
        onRemoval: (id) => {
          dispatch(removeNotification({ id }));
        },
      });
    });
  });

  return (
    <div className="notifications-wrapper">
      <ReactNotification />
    </div>
  );
}
