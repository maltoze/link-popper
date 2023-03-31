export function isSameOrigin(linkUrl: string) {
  const url = new URL(linkUrl);
  return location.origin === url.origin;
}

export default function getEventTarget(event: Event): EventTarget | null {
  if (event.composedPath) {
    return event.composedPath()[0];
  }
  return event.target;
}
