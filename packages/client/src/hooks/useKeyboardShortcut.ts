import { useEffect } from 'react';
import { useModalContext } from '../providers/ModalContext';

type EventHandlingOptions = {
  allowHTMLInput?: boolean;
  allowWhenModalIsOpen?: boolean;
  customAllowCondition?: boolean;
};

/**
 * Custom hook for registering keyboard shortcuts.
 * Predicate function is used for "disabling" the shortcut without needing to
 * hardcode the condition in the callback.
 */
export default (
  key: string,
  callback: (e: KeyboardEvent) => void,
  {
    allowHTMLInput = false,
    allowWhenModalIsOpen = false,
    customAllowCondition = true,
  }: EventHandlingOptions = {},
) => {
  const { isModalOpen } = useModalContext();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // ignore events from <input /> element
      if (e.target instanceof HTMLInputElement && !allowHTMLInput) return;

      // ignore events when a modal is open
      if (isModalOpen && !allowWhenModalIsOpen) return;

      // ignore user provided condition fails
      if (!customAllowCondition) return;

      if (e.key === key) callback(e);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [
    callback,
    customAllowCondition,
    isModalOpen,
    key,
    allowHTMLInput,
    allowWhenModalIsOpen,
  ]);
};
