import browser from 'webextension-polyfill';
import { S_PAGES_KEY } from '../constants';

browser.action.onClicked.addListener(async (tab) => {
  if (tab.url) {
    const url = new URL(tab.url);
    const pageUrl = `${url.origin}${url.pathname}`;
    const data = await browser.storage.sync.get(S_PAGES_KEY);
    const peekPages = data[S_PAGES_KEY] as string[];
    if (peekPages.includes(pageUrl)) {
      const pIndex = peekPages.indexOf(pageUrl);
      peekPages.splice(pIndex, 1);
      browser.storage.sync.set({ [S_PAGES_KEY]: peekPages });
    } else {
      browser.storage.sync.set({
        [S_PAGES_KEY]: [...(peekPages ?? []), pageUrl],
      });
    }
  }
});
