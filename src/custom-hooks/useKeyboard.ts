import { useEffect } from 'react';

export function useKeyboard(key: string, action: () => void) {
  useEffect(() => {
    function handleKeypress(e: KeyboardEvent) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', handleKeypress);
    return function () {
      document.removeEventListener('keydown', handleKeypress);
    };
  }, [action, key]);
}
