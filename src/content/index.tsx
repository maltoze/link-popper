import { render } from 'preact';
import App from './App';
import { computePosition, shift, flip, offset } from '@floating-ui/dom';
import {
  popperContainerId,
  popperThumbContainerId,
  rootId,
  zIndex,
} from './constants';
import logo from '../logo.png';

let popperTitle: string;
let popperUrl: string;

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
  const rootNode = document.querySelector(`#${rootId}`);
  const popperContainer = rootNode?.shadowRoot?.querySelector(
    `#${popperContainerId}`
  );
  const thumbContainer = rootNode?.shadowRoot?.querySelector(
    `#${popperThumbContainerId}`
  );
  popperContainer && render(null, popperContainer);
  popperContainer?.remove();
  thumbContainer?.remove();
}

function handleWindowClickEvent(event: MouseEvent) {
  const composedPath = event.composedPath();
  const target = composedPath.find((node) => node instanceof HTMLAnchorElement);

  if (target instanceof HTMLAnchorElement) {
    const shouldHandle = shouldHandleClickEvent(target.href);
    if (shouldHandle) {
      event.preventDefault();
      event.stopPropagation();

      popperUrl = target.href;
      popperTitle = target.text;

      showPopperThumb();

      const rootNode = document.querySelector(`#${rootId}`);
      const thumbContainer: HTMLDivElement | null =
        rootNode?.shadowRoot?.querySelector(`#${popperThumbContainerId}`) ??
        null;
      if (thumbContainer) {
        computePosition(target, thumbContainer, {
          placement: 'top-end',
          middleware: [offset(4), flip(), shift()],
        }).then(({ x, y }) => {
          Object.assign(thumbContainer.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    }
  }
}

function showPopperThumb() {
  const rootNode = document.querySelector(`#${rootId}`);
  let thumbContainer: HTMLDivElement | null =
    rootNode?.shadowRoot?.querySelector(`#${popperThumbContainerId}`) ?? null;

  if (!thumbContainer) {
    thumbContainer = document.createElement('div');
    thumbContainer.id = popperThumbContainerId;
    thumbContainer.style.position = 'absolute';
    thumbContainer.style.zIndex = zIndex;
    thumbContainer.style.padding = '2px';
    thumbContainer.style.borderRadius = '4px';
    thumbContainer.style.boxShadow =
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
    thumbContainer.style.width = '24px';
    thumbContainer.style.height = '24px';
    thumbContainer.style.background = '#f4f4f5';
    thumbContainer.style.cursor = 'pointer';
    thumbContainer.style.boxSizing = 'border-box';
    thumbContainer.addEventListener('click', showPopper);

    const thumbImg = document.createElement('img');
    thumbImg.src = logo;
    thumbImg.style.display = 'block';
    thumbImg.style.width = '100%';
    thumbImg.style.height = '100%';
    thumbContainer.appendChild(thumbImg);

    rootNode?.shadowRoot?.appendChild(thumbContainer);
  }

  thumbContainer.style.display = 'block';
  // thumbContainer.style.left = `${event.pageX + thumbOffset}px`;
  // thumbContainer.style.top = `${event.pageY + thumbOffset}px`;
}

function showPopper() {
  const rootNode = document.querySelector(`#${rootId}`);
  let popperContainer: HTMLDivElement | null =
    rootNode?.shadowRoot?.querySelector(`#${popperContainerId}`) ?? null;

  if (!popperContainer) {
    popperContainer = document.createElement('div');
    popperContainer.id = popperContainerId;
    popperContainer.style.width = '50%';
    popperContainer.style.height = '100%';
    popperContainer.style.position = 'fixed';
    popperContainer.style.zIndex = zIndex;
    popperContainer.style.height = '100vh';

    rootNode?.shadowRoot?.appendChild(popperContainer);
  }

  const thumbContainer = rootNode?.shadowRoot?.querySelector(
    `#${popperThumbContainerId}`
  );

  if (thumbContainer) {
    computePosition(thumbContainer, popperContainer, {
      placement: 'right',
      middleware: [offset(10), flip(), shift()],
    }).then(({ placement }) => {
      if (placement === 'left') {
        popperContainer &&
          Object.assign(popperContainer?.style, {
            left: `0px`,
            top: '0px',
            right: null,
          });
      } else {
        popperContainer &&
          Object.assign(popperContainer.style, {
            right: '0px',
            top: '0px',
            left: null,
          });
      }
    });
  }

  render(
    <App url={popperUrl} title={popperTitle} onClose={handleOnClose} />,
    popperContainer
  );
}

function handleDocumentMouseDown(event: MouseEvent) {
  const rootNode = document.querySelector(`#${rootId}`);
  const popperContainer: HTMLDivElement | null =
    rootNode?.shadowRoot?.querySelector(`#${popperContainerId}`) ?? null;
  const thumbContainer = rootNode?.shadowRoot?.querySelector(
    `#${popperThumbContainerId}`
  );

  const composedPath = event.composedPath();
  if (
    popperContainer?.contains(composedPath[0] as Node) ||
    thumbContainer?.contains(composedPath[0] as Node) ||
    composedPath.find((node) => node instanceof HTMLAnchorElement)
  ) {
    return;
  }
  handleOnClose();
}

async function main() {
  const root = document.createElement('div');
  root.id = rootId;
  document.body.appendChild(root);
  root.attachShadow({ mode: 'open' });

  document.addEventListener('mouseenter', handleWindowClickEvent, {
    capture: true,
  });

  document.addEventListener('mousedown', handleDocumentMouseDown);
}

main();
