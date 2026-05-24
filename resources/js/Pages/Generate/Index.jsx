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

    const isGenerating = status === 'streaming' || status === 'pending';

    return (
        <AuthenticatedLayout>
            <Head title="Générer du contenu" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden sm:rounded-xl">
                        <div className="p-6 lg:p-8">
                            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                Générer du contenu
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Template Selector */}
                                <div className="lg:col-span-1">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-100 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        Templates
                                    </h3>
                                    <TemplateCategoryFilter
                                        selected={categoryFilter}
                                        onChange={setCategoryFilter}
                                    />
                                    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-1">
                                        {filteredTemplates.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 text-sm">
                                                Aucun template trouvé
                                            </div>
                                        ) : (
                                            filteredTemplates.map((template) => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => handleTemplateSelect(template)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                                        selectedTemplate?.id === template.id
                                                            ? 'border-indigo-500 bg-indigo-900/30 shadow-lg shadow-indigo-500/10'
                                                            : 'border-slate-600/50 hover:border-indigo-500/50 bg-slate-700/30 hover:bg-slate-700/50'
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm text-gray-100">
                                                        {template.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                                                        {template.description?.substring(0, 100)}
                                                    </div>
                                                    <div className="mt-2">
                                                        <ModelBadge model={template.category} />
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Editor */}
                                <div className="lg:col-span-2 space-y-5">
                                    {/* Selected template info */}
                                    {selectedTemplate && (
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-400">Template :</span>
                                                        <span className="font-medium text-white">{selectedTemplate.name}</span>
                                                    </div>
                                                    {selectedTemplate.description && (
                                                        <p className="text-xs text-gray-400 mt-1">{selectedTemplate.description}</p>
                                                    )}
                                                </div>
                                                {selectedTemplate.variables?.length > 0 && (
                                                    <div className="hidden sm:flex flex-wrap gap-1.5">
                                                        {selectedTemplate.variables.map((v) => (
                                                            <span
                                                                key={v.name}
                                                                className="inline-flex items-center px-2.5 py-1 bg-indigo-900/50 text-indigo-200 text-xs rounded-lg border border-indigo-500/20"
                                                            >
                                                                {v.label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Mobile variable badges */}
                                            {selectedTemplate.variables?.length > 0 && (
                                                <div className="sm:hidden mt-3 flex flex-wrap gap-1.5">
                                                    {selectedTemplate.variables.map((v) => (
                                                        <span
                                                            key={v.name}
                                                            className="inline-flex items-center px-2 py-1 bg-indigo-900/50 text-indigo-200 text-xs rounded-lg border border-indigo-500/20"
                                                        >
                                                            {v.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Prompt textarea */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Prompt / Variables
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            rows={8}
                                            className="input-dark resize-none"
                                            placeholder={selectedTemplate ? 'Entrez les valeurs des variables ici...' : 'Entrez votre prompt ici...'}
                                            disabled={isGenerating}
                                        />
                                    </div>

                                    {/* Model selector and generate button */}
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                Modèle
                                            </label>
                                            <select
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                className="select-dark w-full sm:w-auto"
                                                disabled={isGenerating}
                                            >
                                                <option value="openai">GPT-4o</option>
                                                <option value="claude">Claude Sonnet</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleGenerate}
                                                disabled={!prompt || isGenerating}
                                                className="gradient-btn-secondary inline-flex items-center gap-2 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {status === 'pending' ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        En attente...
                                                    </>
                                                ) : status === 'streaming' ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Génération en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        Générer
                                                    </>
                                                )}
                                            </button>

                                            {status !== 'idle' && (
                                                <button
                                                    onClick={reset}
                                                    className="px-4 py-2.5 bg-slate-700 text-gray-200 font-medium rounded-lg hover:bg-slate-600 transition-all duration-300 border border-slate-600"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Output */}
                                    {(status !== 'idle' || output) && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                Résultat
                                            </label>
                                            <StreamingText
                                                content={output}
                                                isStreaming={status === 'streaming'}
                                            />
                                        </div>
                                    )}

                                    {/* Export Buttons */}
                                    {status === 'completed' && output && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                Exporter
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleExport('markdown')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Télécharger MD
                                                </button>
                                                <button
                                                    onClick={() => handleExport('pdf')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm rounded-lg hover:from-red-500 hover:to-rose-500 transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    Télécharger PDF
                                                </button>
                                                <button
                                                    onClick={() => handleExport('docx')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Télécharger DOCX
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {status === 'failed' && (
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-red-900/30 to-rose-900/30 border border-red-700/50 text-red-200 text-sm flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
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