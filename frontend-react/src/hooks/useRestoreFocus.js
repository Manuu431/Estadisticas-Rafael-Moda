import { useEffect, useState } from 'react';

export function useRestoreFocus() {
    const [opener] = useState(() => document.activeElement);

    useEffect(() => () => {
        if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    }, [opener]);
}