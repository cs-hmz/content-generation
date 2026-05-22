import React, { useEffect, useRef, useState } from 'react';

export default function StreamingText({ content, isStreaming = false }) {
    const [showCursor, setShowCursor] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(() => {
                setShowCursor((prev) => !prev);
            }, 530);
            return () => clearInterval(interval);
        } else {
            setShowCursor(false);
        }
    }, [isStreaming]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [content]);

    return (
        <div
            ref={containerRef}
            className="w-full h-64 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap"
        >
            {content || (
                <span className="text-gray-400 dark:text-gray-500">
                    {isStreaming ? 'En attente du contenu...' : 'Le résultat apparaîtra ici...'}
                </span>
            )}
            {showCursor && isStreaming && (
                <span className="inline-block w-2 h-4 bg-blue-500 dark:bg-blue-400 ml-0.5 animate-pulse" />
            )}
        </div>
    );
}