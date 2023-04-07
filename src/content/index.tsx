import { signal } from '@preact/signals';
import { render } from 'preact';
import App from './App';
import { computePosition, shift, flip, offset } from '@floating-ui/dom';
import getEventTarget from '../common/utils';

const rootId = '__maltoze-linkpopper';
const containerId = '__maltoze_linkpopper-container';

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

function handleOnClose() {
  const rootNode: HTMLElement | null = document.querySelector(`#${rootId}`);
  rootNode && (rootNode.style.display = 'none');
  // const container = document.querySelector(`#${containerId}`);
  // container && render(null, container);
  url.value = null;
}

function handleWindowClickEvent(event: MouseEvent) {
  const composedPath = event.composedPath();
  const target = composedPath.find((node) => node instanceof HTMLAnchorElement);

  if (target instanceof HTMLAnchorElement) {
    const shouldHandle = shouldHandleClickEvent(target.href);
    if (shouldHandle) {
      event.preventDefault();
      event.stopPropagation();

      url.value = target.href;
      title.value = target.text;
      loading.value = true;

      const rootNode: HTMLElement | null = document.querySelector(`#${rootId}`);
      if (rootNode) {
        if (rootNode.style.display === 'none') {
          rootNode.style.display = 'block';
        }
        computePosition(target, rootNode, {
          placement: 'right',
          middleware: [offset(10), flip(), shift()],
        }).then(({ placement }) => {
          if (placement === 'left') {
            Object.assign(rootNode.style, {
              left: `0px`,
              top: '0px',
              right: null,
            });
          } else {
            Object.assign(rootNode.style, {
              right: '0px',
              top: '0px',
              left: null,
            });
          }
        });
      }
    }
  }
}

async function main() {
  const root = document.createElement('div');
  root.id = rootId;
  root.style.position = 'fixed';
  root.style.zIndex = '2147483647';
  root.style.height = '100vh';
  root.style.width = '50%';
  root.style.display = 'none';
  document.body.appendChild(root);

  root.attachShadow({ mode: 'open' });

  const appContainer = document.createElement('div');
  appContainer.id = containerId;
  appContainer.style.width = '100%';
  appContainer.style.height = '100%';
  root.shadowRoot?.appendChild(appContainer);

  render(
    <App url={url} title={title} loading={loading} onClose={handleOnClose} />,
    appContainer
  );

  window.addEventListener('click', handleWindowClickEvent, { capture: true });

  const mouseDownListener = (event: MouseEvent | TouchEvent) => {
    if (
      appContainer.contains(getEventTarget(event) as Node) ||
      event.composedPath().find((node) => node instanceof HTMLAnchorElement)
    ) {
      return;
    }
    handleOnClose();
  };
  document.addEventListener('mousedown', mouseDownListener);
}

main();
