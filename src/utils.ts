export function debounce<T extends any[]>(
  callback: (...args: T) => void,
  wait: number
) {
  let timeout: any = null;
  return (...args: T) => {
    const next = () => callback(...args);
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
  };
}
