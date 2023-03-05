export function isSameOrigin(linkUrl: string) {
  const url = new URL(linkUrl);
  return location.origin === url.origin;
}
