import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useGeneration } from '@/Hooks/useGeneration';
import TemplateCategoryFilter from '@/Components/TemplateCategoryFilter';
import StreamingText from '@/Components/StreamingText';
import ModelBadge from '@/Components/ModelBadge';

export default function Generate({ templates: initialTemplates }) {
    const { status, output, generate, reset } = useGeneration();
    const [templates, setTemplates] = useState(initialTemplates?.data || []);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('openai');

    const filteredTemplates = categoryFilter
        ? templates.filter((t) => t.category === categoryFilter)
        : templates;

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        const variableNames = template.variables?.map((v) => v.name) || [];
        if (variableNames.length > 0) {
            setPrompt(variableNames.map((name) => `[${name}]`).join('\n'));
        } else {
            setPrompt('');
        }
    };

    const handleGenerate = () => {
        generate({
            templateId: selectedTemplate?.id || null,
            prompt,
            model,
        });
    };

    const handleExport = async (format) => {
        if (!output || status !== 'completed') return;

        try {
            const res = await fetch(`/api/generations/${output.generationId}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
                body: JSON.stringify({ format }),
            });

            if (format === 'markdown' || format === 'docx') {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `generation.${format}`;
                a.click();
            } else if (format === 'pdf') {
                const data = await res.json();
                window.open(data.url, '_blank');
            }
        } catch (e) {
            console.error('Export failed:', e);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Générer du contenu" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-800/50 backdrop-blur border border-white/10 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 text-white">
                                Générer du contenu
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Template Selector */}
                                <div className="lg:col-span-1">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-100">
                                        Templates
                                    </h3>
                                    <TemplateCategoryFilter
                                        selected={categoryFilter}
                                        onChange={setCategoryFilter}
                                    />
                                    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                                        {filteredTemplates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleTemplateSelect(template)}
                                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                    selectedTemplate?.id === template.id
                                                        ? 'border-indigo-400 bg-indigo-900/30'
                                                        : 'border-gray-600 hover:border-indigo-500 bg-slate-700/50'
                                                }`}
                                            >
                                                <div className="font-medium text-sm text-gray-100">
                                                    {template.name}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {template.description?.substring(0, 80)}...
                                                </div>
                                                <ModelBadge model={template.category} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Editor */}
                                <div className="lg:col-span-2 space-y-4">
                                    {selectedTemplate && (
                                        <div className="p-3 bg-slate-700/50 border border-white/10 rounded-lg">
                                            <div className="font-medium text-sm text-gray-200">
                                                Template : {selectedTemplate.name}
                                            </div>
                                            {selectedTemplate.variables?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selectedTemplate.variables.map((v) => (
                                                        <span
                                                            key={v.name}
                                                            className="inline-flex items-center px-2 py-1 bg-indigo-900/50 text-indigo-200 text-xs rounded"
                                                        >
                                                            {v.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Prompt / Variables
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            rows={6}
                                            className="w-full rounded-md bg-slate-600 border border-slate-500 text-white placeholder-gray-400 shadow-sm focus:bg-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-colors px-3 py-2 resize-none"
                                            placeholder="Entrez votre prompt ou les valeurs des variables ici..."
                                            disabled={status === 'streaming' || status === 'pending'}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                Modèle
                                            </label>
                                            <select
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                className="rounded-md bg-slate-600 border border-slate-500 text-white shadow-sm focus:bg-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-colors px-3 py-2"
                                                disabled={status === 'streaming' || status === 'pending'}
                                            >
                                                <option value="openai">GPT-4o</option>
                                                <option value="claude">Claude Sonnet</option>
                                            </select>
                                        </div>

                                        <div className="pt-5">
                                            <button
                                                onClick={handleGenerate}
                                                disabled={!prompt || status === 'streaming' || status === 'pending'}
                                                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {status === 'pending'
                                                    ? 'En attente...'
                                                    : status === 'streaming'
                                                    ? 'Génération en cours...'
                                                    : 'Générer'}
                                            </button>

                                            {status !== 'idle' && (
                                                <button
                                                    onClick={reset}
                                                    className="ml-2 px-4 py-2 bg-slate-700 text-gray-200 font-medium rounded-md hover:bg-slate-600 transition-colors"
                                                >
                                                    Réinitialiser
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Output */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">
                                            Résultat
                                        </label>
                                        <StreamingText
                                            content={output}
                                            isStreaming={status === 'streaming'}
                                        />
                                    </div>

                                    {/* Export Buttons */}
                                    {status === 'completed' && output && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleExport('markdown')}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-500 transition-colors"
                                            >
                                                Télécharger MD
                                            </button>
                                            <button
                                                onClick={() => handleExport('pdf')}
                                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition-colors"
                                            >
                                                Télécharger PDF
                                            </button>
                                            <button
                                                onClick={() => handleExport('docx')}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 transition-colors"
                                            >
                                                Télécharger DOCX
                                            </button>
                                        </div>
                                    )}

                                    {status === 'failed' && (
                                        <div className="p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg text-sm">
                                            La génération a échoué. Veuillez réessayer.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}