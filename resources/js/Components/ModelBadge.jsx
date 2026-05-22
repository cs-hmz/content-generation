import React from 'react';

export default function ModelBadge({ model }) {
    if (!model) return null;

    const isOpenAI = model === 'openai' || model?.toLowerCase().includes('gpt');
    const isClaude = model === 'claude' || model?.toLowerCase().includes('claude');

    const classes = isOpenAI
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        : isClaude
        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

    const label = isOpenAI ? 'GPT-4o' : isClaude ? 'Claude' : model;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {label}
        </span>
    );
}