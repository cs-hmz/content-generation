import React from 'react';

export default function ModelBadge({ model }) {
    if (!model) return null;

    const isOpenAI = model === 'openai' || model?.toLowerCase().includes('gpt');
    const isClaude = model === 'claude' || model?.toLowerCase().includes('claude');

    const classes = isOpenAI
        ? 'bg-purple-900/50 text-purple-200'
        : isClaude
        ? 'bg-orange-900/50 text-orange-200'
        : 'bg-slate-700 text-gray-300';

    const label = isOpenAI ? 'GPT-4o' : isClaude ? 'Claude' : model;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {label}
        </span>
    );
}