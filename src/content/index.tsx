import browser from 'webextension-polyfill';
import { signal } from '@preact/signals';
import { render } from 'preact';
import App from './App';
import { S_PAGES_KEY } from '../constants';

const containerId = 'linkpopper-container';

const open = signal(false);
const url = signal<string | null>(null);

const currentPageUrl = `${location.origin}${location.pathname}`;

async function handleAnchorClick(evt: MouseEvent) {
  evt.preventDefault();

  if (evt.currentTarget instanceof HTMLAnchorElement) {
    const target = evt.currentTarget;
    open.value = true;
    url.value = target.href;
  }
}

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
    <App open={open} url={url} />,
    document.querySelector(`#${containerId}`) ?? document.body
  );
}

const anchors = document.querySelectorAll('a');

async function main() {
  renderApp();

  const data = await browser.storage.sync.get(S_PAGES_KEY);
  const peekPages = data[S_PAGES_KEY] as string[];
  if (peekPages.includes(currentPageUrl)) {
    anchors.forEach(async (anchor) => {
      if (shouldHandleClickEvent(anchor.href)) {
        anchor.addEventListener('click', handleAnchorClick);
      }
    });
  }

  browser.storage.onChanged.addListener(({ peekPages }) => {
    const newValues = peekPages.newValue as string[];
    const oldValues = peekPages.oldValue as string[];
    if (
      oldValues.includes(currentPageUrl) &&
      !newValues.includes(currentPageUrl)
    ) {
      anchors.forEach(async (anchor) => {
        if (shouldHandleClickEvent(anchor.href)) {
          anchor.removeEventListener('click', handleAnchorClick);
        }
      });
    } else if (
      !oldValues.includes(currentPageUrl) &&
      newValues.includes(currentPageUrl)
    ) {
      anchors.forEach(async (anchor) => {
        if (shouldHandleClickEvent(anchor.href)) {
          anchor.addEventListener('click', handleAnchorClick);
        }
      });
    }
  });
}

main();
