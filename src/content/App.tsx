import { Dialog, Transition } from '@headlessui/react';
import { Signal } from '@preact/signals';
import '../styles/global.css';
import { Fragment } from 'preact';
import { HiArrowTopRightOnSquare, HiXMark } from 'react-icons/hi2';
import { CgSpinnerAlt } from 'react-icons/cg';

type Props = {
  open: Signal<boolean>;
  url: Signal<string | null>;
  title: Signal<string | null>;
  loading: Signal<boolean>;
};

export default function App({ open, url, title, loading }: Props) {
  if (!url.value) return null;

  function handleClose() {
    open.value = false;
  }

  function handleOnLoad() {
    loading.value = false;
  }

  return (
    <Transition show={open.value} as={Fragment} appear={true}>
      <Dialog className="relative z-[9999]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 dark:bg-black/70" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-[calc(100%-96px)] items-center justify-center py-12 px-20 md:px-32 lg:px-48">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full shadow-lg">
                <div className="grid h-10 grid-cols-6 items-center gap-4 rounded-t-xl bg-zinc-200 px-4 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                  <div className="col-span-4 col-start-2 inline-flex items-center justify-center gap-2">
                    {loading.value ? (
                      <i className="h-5 w-5 shrink-0 animate-spin">
                        <CgSpinnerAlt size={22} />
                      </i>
                    ) : (
                      <i className="h-5 w-5"></i>
                    )}
                    <span className="truncate text-sm">{title}</span>
                  </div>
                  <div className="flex items-center justify-end ">
                    <a
                      href={url.value}
                      target="_blank"
                      className="text-zinc-800 visited:text-zinc-800 hover:text-zinc-400 dark:text-zinc-100 dark:visited:text-zinc-100"
                    >
                      <HiArrowTopRightOnSquare size={20} />
                    </a>
                    <button
                      className="m-0 border-0 bg-transparent p-0 pl-2 text-zinc-800 hover:text-zinc-400 dark:text-zinc-100"
                      onClick={handleClose}
                    >
                      <HiXMark size={24} />
                    </button>
                  </div>
                </div>
                <iframe
                  src={url.value}
                  onLoad={handleOnLoad}
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
