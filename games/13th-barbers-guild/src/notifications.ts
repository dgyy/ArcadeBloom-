import { absDiv, getElement } from "./utils";
import { theme } from "./theme";

export function createNotifications(width: number, height: number) {
  const content = absDiv(
    `<div id="${import.meta.env.VITE_ID_NOTIFICATIONS}"><span></span></div>`,
    import.meta.env.VITE_ID_NOTIFICATIONS_WRAPPER,
    width,
    height,
    theme.layers.notification,
  );
  setTimeout(() => {
    let onDismissed: (() => void) | undefined;
    let messages: string[] = [];
    let hasDismissed: boolean = true;
    let canDismiss: boolean = true;
    function renderLatestMessage(canDismiss: boolean) {
      const message = messages.shift();
      if (!message && !canDismiss) {
        return false;
      }
      const element = getElement(import.meta.env.VITE_ID_NOTIFICATIONS);
      const span = element.querySelector("span");
      const parent = element.parentElement;
      if (!span || !parent) {
        throw new Error("Missing span");
      }
      span.innerHTML = message ?? "";
      element.style.display = message ? "flex" : "none";
      return Boolean(message);
    }
    function onNotify(event: WindowEventMap["notify"]) {
      onDismissed = event.detail.onDismissed;
      messages = event.detail.messages;
      hasDismissed = false;
      canDismiss = !event.detail.preventDismiss;
      renderLatestMessage(canDismiss);
    }
    function onDismiss() {
      const hasRendered = renderLatestMessage(canDismiss);
      if (!hasRendered && !hasDismissed && onDismissed) {
        hasDismissed = true;
        onDismissed();
      }
    }
    window.addEventListener("notify", onNotify);
    window.addEventListener("dismiss", onDismiss);
    window.addEventListener("reset", () => {
      canDismiss = true;
      window.removeEventListener("notify", onNotify);
      window.removeEventListener("dismiss", onDismiss);
    });
  });
  return content;
}
