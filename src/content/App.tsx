import { Dialog, Transition } from '@headlessui/react';
import { Signal } from '@preact/signals';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import '../styles/global.css';
import { Fragment } from 'preact';

type Props = {
  open: Signal<boolean>;
  url: Signal<string | null>;
};

export default function App({ open, url }: Props) {
  if (!url.value) return null;

  return (
    <Transition show={open.value} as={Fragment} appear={true}>
      <Dialog
        className="relative z-[9999]"
        onClose={() => (open.value = false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 dark:bg-black/70" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-[calc(100%-96px)] items-center justify-center py-12 px-20 md:px-48">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full shadow-xl">
                <div className="flex h-10 items-center justify-end rounded-t-xl bg-zinc-200 pr-4 dark:bg-zinc-800">
                  <a href={url.value} target="_blank" title="Open in new tab">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-zinc-800 hover:text-zinc-400 dark:text-zinc-100" />
                  </a>
                </div>
                <iframe
                  src={url.value}
                  className="h-[calc(100%-40px)] w-full border-none bg-zinc-100 dark:bg-zinc-600"
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
