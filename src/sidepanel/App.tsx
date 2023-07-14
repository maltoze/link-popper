import { useState } from 'preact/hooks'
import { useHotkeys } from 'react-hotkeys-hook'

export default function App() {
  const [url, setUrl] = useState<string>()

  const addrInputRef = useHotkeys<HTMLInputElement>(
    'enter',
    () => {
      setUrl(addrInputRef.current?.value)
    },
    { preventDefault: true, enableOnFormTags: ['input'] }
  )

  return (
    <div className="fixed inset-0">
      <div className="py-1.5 px-2 bg-zinc-800">
        <input
          className="w-full h-9 rounded-full focus:ring-2 bg-zinc-900 text-slate-200 text-sm ring-blue-600 px-3 outline-none"
          ref={addrInputRef}
        />
      </div>
      <iframe
        src={url}
        className="h-full w-full select-none border-none bg-zinc-50"
      />
    </div>
  )
}
