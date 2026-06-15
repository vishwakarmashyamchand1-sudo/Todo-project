export const sendBrowserNotification = (title, body) => {
  try {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      }).catch(err => console.warn("Notification permission request failed", err));
    }
  } catch (error) {
    console.warn("Browser notifications failed or blocked in this environment:", error);
  }
};
