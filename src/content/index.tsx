import browser from 'webextension-polyfill';
import { signal } from '@preact/signals';
import { render } from 'preact';
import App from './App';
import { S_PAGES_KEY, URL_CHANGED } from '../constants';

const containerId = 'linkpopper-container';

const open = signal(false);
const url = signal<string | null>(null);
const title = signal<string | null>(null);
const loading = signal(false);

let currentPageUrl = `${location.origin}${location.pathname}`;

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

function renderApp() {
  const container = document.createElement('div');
  container.id = containerId;
  document.body.appendChild(container);

  render(
    <App open={open} url={url} title={title} loading={loading} />,
    document.querySelector(`#${containerId}`) ?? document.body
  );
}

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
  renderApp();

  const data = await browser.storage.sync.get(S_PAGES_KEY);
  const peekPages = data[S_PAGES_KEY] as string[];
  if (peekPages.includes(currentPageUrl)) {
    window.addEventListener('click', handleWindowClickEvent);
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === URL_CHANGED) {
      currentPageUrl = message.url;
      window.removeEventListener('click', handleWindowClickEvent);
      if (peekPages.includes(currentPageUrl)) {
        window.addEventListener('click', handleWindowClickEvent);
      }
    }
  });

  browser.storage.onChanged.addListener(({ peekPages }) => {
    const newPages = (peekPages.newValue as string[]) ?? [];
    const prevPages = (peekPages.oldValue as string[]) ?? [];
    if (
      prevPages.includes(currentPageUrl) &&
      !newPages.includes(currentPageUrl)
    ) {
      window.removeEventListener('click', handleWindowClickEvent);
    } else if (
      !prevPages.includes(currentPageUrl) &&
      newPages.includes(currentPageUrl)
    ) {
      window.addEventListener('click', handleWindowClickEvent);
    }
  });
}

main();
