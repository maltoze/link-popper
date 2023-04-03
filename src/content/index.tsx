import { signal } from '@preact/signals';
import { render } from 'preact';
import App from './App';
import { isSameOrigin } from '../utils';
import { rules } from './config';

const containerId = '__maltoze_linkpopper-container';

const open = signal(false);
const url = signal<string | null>(null);
const title = signal<string | null>(null);
const loading = signal(false);

const matchRule = rules[location.hostname] ?? null;

function shouldHandleClickEvent(href: string) {
  if (!href) return false;

  if (!isSameOrigin(href)) return false;

  try {
    const url = new URL(href);

    if (url.pathname === '/') {
      return false;
    }

    if (matchRule?.exclude.includes(url.pathname)) {
      return false;
    }

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

function handleWindowClickEvent(event: Event) {
  if (event.target instanceof HTMLAnchorElement) {
    const shouldHandle = shouldHandleClickEvent(event.target.href);
    if (shouldHandle) {
      event.preventDefault();
      open.value = true;
      url.value = event.target.href;
      title.value = event.target.text;
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

  window.addEventListener('click', handleWindowClickEvent);
}

main();
