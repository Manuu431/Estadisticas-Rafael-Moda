import { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../config/axios.js';
import { serializeParams } from '../utils/tableUtils.js';
export function useFetch(url, params) {
    const [result, setResult] = useState({ url: null, data: null });
    const [loading, setLoading] = useState(Boolean(url));
    const [error, setError] = useState(null);
    const requestId = useRef(0);
    const paramsKey = JSON.stringify(params ?? {});
    const refetch = useCallback(async () => {
        const id = ++requestId.current;
        if (!url) {
            setLoading(false);
            setError(null);
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url, { params: JSON.parse(paramsKey), paramsSerializer: serializeParams });
            if (id === requestId.current) setResult({ url, data: response.data });
            return response.data;
        } catch (err) {
            console.error(`Error fetching ${url}:`, err.response ? err.response.data : err);
            if (id === requestId.current) setError(err);
            return null;
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, [url, paramsKey]);
    useEffect(() => {
        refetch();
    }, [refetch]);
    return { data: result.url === url ? result.data : null, loading, error, refetch };
}