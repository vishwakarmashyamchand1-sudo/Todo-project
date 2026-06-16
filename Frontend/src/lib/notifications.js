export const sendBrowserNotification = async (title, body) => {
  try {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }

    const triggerNotification = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.active && registration.showNotification) {
            await registration.showNotification(title, {
              body,
              icon: "/pwa-192x192.png",
              badge: "/pwa-192x192.png"
            });
            return;
          }
        } catch (swError) {
          console.warn("Service Worker notification failed, falling back to window", swError);
        }
      }
      // Fallback for desktop browsers
      new Notification(title, { body, icon: "/pwa-192x192.png" });
    };

    if (Notification.permission === "granted") {
      await triggerNotification();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await triggerNotification();
      }
    }
  } catch (error) {
    console.warn("Browser notifications failed or blocked in this environment:", error);
  }
};
