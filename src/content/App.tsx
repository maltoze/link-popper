import { Signal } from '@preact/signals';
import { HiArrowTopRightOnSquare, HiXMark } from 'react-icons/hi2';
import { CgSpinnerAlt } from 'react-icons/cg';
import { useRef } from 'preact/hooks';
import useOnClickOutside from '../hooks/use-onclickoutside';
import styles from '../styles/global.css';
import { AnimatePresence, motion, Variants } from 'framer-motion';

type Props = {
  open: Signal<boolean>;
  url: Signal<string | null>;
  title: Signal<string | null>;
  loading: Signal<boolean>;
};

const variants: Variants = {
  open: { opacity: 1, height: '100%', width: '100%' },
  closed: { opacity: 0, height: '75%', width: '75%', transition: { duration: 0.1 } },
};

export default function App({ open, url, title, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleClose() {
    open.value = false;
  }

  useOnClickOutside(containerRef, handleClose);

  function handleOnLoad() {
    loading.value = false;
  }

  return (
    <>
      <style type="text/css">{styles.toString()}</style>
      <AnimatePresence>
        {open.value && url.value && (
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-full flex-col items-center justify-center py-12 px-20 md:px-32 lg:px-48">
              <motion.div
                className="shadow-xl"
                ref={containerRef}
                layout
                animate="open"
                exit="closed"
                variants={variants}
                initial="closed"
              >
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
                      className="text-zinc-800 hover:text-zinc-400 dark:text-zinc-100"
                      rel="noreferrer"
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
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
