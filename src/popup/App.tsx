import styles from '../styles/global.css';
import browser from 'webextension-polyfill';
import { useEffect, useState } from 'preact/hooks';
import { useSettings } from '../hooks/use-settings';
import * as utils from '../common/utils';
import { ISettings } from '../common/types';
import cx from 'classnames';

async function getCurrentUrl() {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab.url) {
    const tabUrl = new URL(tab.url);
    return `${tabUrl.origin}${tabUrl.pathname}`;
  }
  return null;
}

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const included = currentUrl ? settings?.urlList.includes(currentUrl) : false;

  useEffect(() => {
    (async () => setCurrentUrl(await getCurrentUrl()))();
  }, []);

  async function handleToggleClick() {
    let newUrlList: ISettings['urlList'];
    if (included) {
      newUrlList = settings?.urlList.filter((url) => url !== currentUrl) ?? [];
    } else {
      newUrlList = currentUrl ? [...(settings?.urlList ?? []), currentUrl] : [];
    }
    await utils.setSettings({ urlList: newUrlList });
    setSettings({ urlList: newUrlList });
  }

  return (
    <>
      <style type="text/css">{styles.toString()}</style>
      <div className="flex w-64 flex-col gap-2 p-3">
        <label className="break-words text-sm">Current URL: {currentUrl}</label>
        <button
          className={cx(
            'w-full rounded px-6 py-2 text-zinc-100 disabled:bg-zinc-400',
            {
              'bg-red-600 hover:bg-red-700': included,
              'bg-blue-600 hover:bg-blue-700': !included,
            }
          )}
          disabled={!currentUrl}
          onClick={handleToggleClick}
        >
          {included ? 'Disable' : 'Enable'}
        </button>
      </div>
    </>
  );
}
