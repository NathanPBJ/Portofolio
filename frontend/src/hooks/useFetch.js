import { useState, useEffect, useCallback } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const json = await response.json();
            if (json.success) {
                setData(json.data);
            } else {
                throw new Error(json.message || 'API returned false success flag');
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        const timeout = setTimeout(fetchData, 0);
        return () => clearTimeout(timeout);
    }, [fetchData]);

    const refetch = () => {
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useFetch;
