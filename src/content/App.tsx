import { Signal } from '@preact/signals';
import { RxCross1, RxOpenInNewWindow } from 'react-icons/rx';
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
  closed: {
    opacity: 0,
    height: '75%',
    width: '75%',
    transition: { duration: 0.1 },
  },
};

export default function App({ open, url, title, loading }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function handleClose() {
    open.value = false;
  }

  useOnClickOutside(containerRef, handleClose);

  function handleOnLoad() {
    loading.value = false;
    const iframeTitle = iframeRef.current?.contentDocument?.title;
    if (iframeTitle) {
      title.value = iframeTitle;
    }
  }

  function handleOpenInMainFrame(event: MouseEvent) {
    event.stopPropagation();

    const iframeDocument = iframeRef.current?.contentDocument;
    if (url.value) {
      window.location.href = iframeDocument?.location.href ?? url.value;
    }
  }

  function handleOpenInNewTab(event: MouseEvent) {
    event.stopPropagation();

    const iframeDocument = iframeRef.current?.contentDocument;
    url.value &&
      window.open(iframeDocument?.location.href ?? url.value, '_blank');
  }

  return (
    <>
      <style type="text/css">{styles.toString()}</style>
      <AnimatePresence>
        {open.value && url.value && (
          <div className="fixed inset-0 z-[2147483647] overflow-y-auto">
            <div className="flex h-full flex-col items-center justify-center py-12 px-20 md:px-32 lg:px-48">
              <motion.div
                className="shadow-xl"
                ref={containerRef}
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
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleOpenInNewTab}
                      className="header-icon-btn"
                    >
                      <RxOpenInNewWindow size={20} />
                    </button>
                    <button
                      className="header-icon-btn rotate-[270deg]"
                      onClick={handleOpenInMainFrame}
                    >
                      <RxOpenInNewWindow size={20} />
                    </button>
                    <button className="header-icon-btn" onClick={handleClose}>
                      <RxCross1 size={18} />
                    </button>
                  </div>
                </div>
                <iframe
                  ref={iframeRef}
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
