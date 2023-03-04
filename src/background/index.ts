import browser from 'webextension-polyfill';
import { S_PAGES_KEY, URL_CHANGED } from '../constants';

const storageCache: { [key: string]: string[] } = { [S_PAGES_KEY]: [] };
const initStorageCache = browser.storage.sync.get().then((items) => {
  Object.assign(storageCache, items);
});

browser.action.onClicked.addListener(async (tab) => {
  if (tab.url) {
    try {
      await initStorageCache;
    } catch (e) {
      console.error(e);
      return;
    }
    const url = new URL(tab.url);
    const pageUrl = `${url.origin}${url.pathname}`;
    const peekPages = storageCache[S_PAGES_KEY] as string[];
    if (peekPages.includes(pageUrl)) {
      const pIndex = peekPages.indexOf(pageUrl);
      peekPages.splice(pIndex, 1);
      storageCache[S_PAGES_KEY] = peekPages;
      await browser.storage.sync.set(storageCache);
      browser.action.setIcon({ tabId: tab.id, path: 'logo-gray.png' });
    } else {
      storageCache[S_PAGES_KEY] = [...(peekPages ?? []), pageUrl];
      await browser.storage.sync.set(storageCache);
      browser.action.setIcon({ tabId: tab.id, path: 'logo.png' });
    }
  }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url) {
    const pages = storageCache[S_PAGES_KEY] as string[];
    const url = new URL(tab.url);
    if (pages.includes(`${url.origin}${url.pathname}`) && changeInfo.url) {
      browser.tabs.sendMessage(tabId, {
        url: changeInfo.url,
        type: URL_CHANGED,
      });
    }

    if (changeInfo.url || changeInfo?.status === 'loading') {
      if (pages.includes(`${url.origin}${url.pathname}`)) {
        browser.action.setIcon({ tabId, path: 'logo.png' });
      } else {
        browser.action.setIcon({ tabId, path: 'logo-gray.png' });
      }
    }
  }
});
