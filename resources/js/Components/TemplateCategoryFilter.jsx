import React from 'react';

const CATEGORIES = [
    { value: '', label: 'Tous' },
    { value: 'article', label: 'Article' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Réseaux sociaux' },
    { value: 'custom', label: 'Personnalisé' },
];

export default function TemplateCategoryFilter({ selected, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.value}
                    onClick={() => onChange(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selected === cat.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}