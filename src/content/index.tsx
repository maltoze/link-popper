import { signal } from '@preact/signals';
import { render } from 'preact';
import App from './App';

const containerId = '__maltoze_linkpopper-container';

const open = signal(false);
const url = signal<string | null>(null);
const title = signal<string | null>(null);
const loading = signal(false);

function shouldHandleClickEvent(href: string) {
  if (!href) return false;

  try {
    const url = new URL(href);

    if (url.origin === location.origin && url.pathname === location.pathname) {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  if (/^(mailto|tel|javascript):/.test(href)) {
    return false;
  }
  return true;
}

// function destroyApp() {
//   const container = document.querySelector(`#${containerId}`);
//   container && render(null, container);
// }

function handleWindowClickEvent(event: MouseEvent) {
  const composedPath = event.composedPath();
  const target = composedPath.find((node) => node instanceof HTMLAnchorElement);

  if (target instanceof HTMLAnchorElement) {
    const shouldHandle = shouldHandleClickEvent(target.href);
    if (shouldHandle) {
      event.preventDefault();
      event.stopPropagation();

      const targetUrl = new URL(target.href);
      if (targetUrl.protocol !== location.protocol) {
        targetUrl.protocol = location.protocol;
      }
      url.value = targetUrl.href;
      open.value = true;
      title.value = target.text;
      loading.value = true;
    }
  }
}

async function main() {
  const root = document.createElement('div');
  root.id = '__maltoze-linkpopper';
  document.body.appendChild(root);

  root.attachShadow({ mode: 'open' });

  const appContainer = document.createElement('div');
  appContainer.id = containerId;
  root.shadowRoot?.appendChild(appContainer);

  render(
    <App open={open} url={url} title={title} loading={loading} />,
    appContainer
  );

  window.addEventListener('click', handleWindowClickEvent, { capture: true });
}

main();
