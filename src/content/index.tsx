import { signal } from '@preact/signals';
import { render } from 'preact';
import browser from 'webextension-polyfill';
import { getSettings } from '../common/utils';
import App from './App';
import styles from '../styles/global.css';

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

    // mixed content will be blocked by browser
    if (url.protocol !== location.protocol) {
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

      url.value = target.href;
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
    <>
      <style type="text/css">{styles.toString()}</style>
      <App open={open} url={url} title={title} loading={loading} />
    </>,
    appContainer
  );

  const settings = await getSettings();
  const currentUrl = `${location.origin}${location.pathname}`;
  if (settings.urlList.includes(currentUrl)) {
    window.addEventListener('click', handleWindowClickEvent, { capture: true });
  }

  browser.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case 'enable':
        window.addEventListener('click', handleWindowClickEvent, {
          capture: true,
        });
        break;
      case 'disable':
        window.removeEventListener('click', handleWindowClickEvent, {
          capture: true,
        });
        break;
    }
  });
}

main();
