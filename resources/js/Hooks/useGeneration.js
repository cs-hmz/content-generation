import { useState, useCallback } from 'react';

export function useGeneration() {
    const [status, setStatus] = useState('idle'); // idle|pending|streaming|completed|failed
    const [output, setOutput] = useState('');
    const [generationId, setGenerationId] = useState(null);
    const [error, setError] = useState(null);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const generate = useCallback(async ({ templateId, prompt, model }) => {
        setStatus('pending');
        setOutput('');
        setError(null);

        try {
            const res = await fetch('/api/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                body: JSON.stringify({ template_id: templateId, prompt, model }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Generation failed');
            }

            const { generation_id, channel } = await res.json();
            setGenerationId(generation_id);
            setStatus('streaming');

            if (window.Echo) {
                const echoChannel = window.Echo.private(channel);

                echoChannel.listen('.token.received', (e) => {
                    setOutput((prev) => prev + e.token);
                });

                echoChannel.listen('.completed', () => {
                    setStatus('completed');
                    echoChannel.stopListening('.token.received');
                    echoChannel.stopListening('.completed');
                    echoChannel.stopListening('.failed');
                });

                echoChannel.listen('.failed', (e) => {
                    setStatus('failed');
                    setError(e.error || 'Generation failed');
                    echoChannel.stopListening('.token.received');
                    echoChannel.stopListening('.completed');
                    echoChannel.stopListening('.failed');
                });
            } else {
                // Fallback: poll for completion
                const poll = setInterval(async () => {
                    const genRes = await fetch(`/api/generations/${generation_id}`, {
                        headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                    });
                    const gen = await genRes.json();
                    if (gen.data.status === 'completed') {
                        setOutput(gen.data.result || '');
                        setStatus('completed');
                        clearInterval(poll);
                    } else if (gen.data.status === 'failed') {
                        setStatus('failed');
                        clearInterval(poll);
                    }
                }, 1000);
            }
        } catch (e) {
            setStatus('failed');
            setError(e.message);
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setOutput('');
        setGenerationId(null);
        setError(null);
    }, []);

    return { status, output, generationId, error, generate, reset };
}