import browser from 'webextension-polyfill'
import { useEffect, useState } from 'preact/hooks'
import { useSettings } from '../hooks/use-settings'
import * as utils from '../common/utils'
import { ISettings } from '../common/types'
import cx from 'classnames'
import '../styles/global.css'

async function getCurrentUrl() {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })
  if (tab.url) {
    const tabUrl = new URL(tab.url)
    return `${tabUrl.origin}${tabUrl.pathname}`
  }
  return null
}

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const { settings, setSettings } = useSettings()
  const matched = currentUrl ? settings?.urlList.includes(currentUrl) : false

  useEffect(() => {
    ;(async () => setCurrentUrl(await getCurrentUrl()))()
  }, [])

  async function handleToggleClick() {
    let newUrlList: ISettings['urlList']
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })

    if (matched) {
      newUrlList = settings?.urlList.filter((url) => url !== currentUrl) ?? []
      tab.id && browser.tabs.sendMessage(tab.id, { type: 'disable' })
    } else {
      newUrlList = currentUrl ? [...(settings?.urlList ?? []), currentUrl] : []
      tab.id && browser.tabs.sendMessage(tab.id, { type: 'enable' })
    }

    await utils.setSettings({ urlList: newUrlList })
    setSettings({ urlList: newUrlList })
  }

  return (
    <div className="flex w-64 flex-col gap-2 p-3">
      <div className="flex flex-col gap-2">
        <div className="break-words text-sm">
          Current URL: <span>{currentUrl}</span>
        </div>
        <button
          className={cx(
            'w-full rounded px-6 py-2 text-zinc-100 disabled:bg-zinc-400 disabled:cursor-not-allowed',
            {
              'bg-red-600 hover:bg-red-700': matched,
              'bg-blue-600 hover:bg-blue-700': !matched,
            }
          )}
          disabled={!currentUrl}
          onClick={handleToggleClick}
        >
          {matched ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
