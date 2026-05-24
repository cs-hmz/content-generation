import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TemplateCategoryFilter from '@/Components/TemplateCategoryFilter';
import Modal from '@/Components/Modal';
import ModelBadge from '@/Components/ModelBadge';

export default function Templates({ templates: initialTemplates }) {
    const [templates, setTemplates] = useState(initialTemplates?.data || []);
    const [meta, setMeta] = useState(initialTemplates?.meta || null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [form, setForm] = useState({
        name: '',
        category: 'article',
        description: '',
        system_prompt: '',
        variables: '[]',
        is_public: false,
    });

    const fetchTemplates = async (page = 1) => {
        try {
            const params = new URLSearchParams({ page });
            if (categoryFilter) params.append('category', categoryFilter);

            const res = await fetch(`/api/templates?${params}`, {
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });
            const data = await res.json();
            setTemplates(data.data);
            setMeta(data.meta);
        } catch (e) {
            console.error('Failed to fetch templates:', e);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [categoryFilter]);

    const handleCreate = () => {
        setEditingTemplate(null);
        setForm({ name: '', category: 'article', description: '', system_prompt: '', variables: '[]', is_public: false });
        setShowModal(true);
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setForm({
            name: template.name,
            category: template.category,
            description: template.description || '',
            system_prompt: template.system_prompt,
            variables: JSON.stringify(template.variables || []),
            is_public: template.is_public,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const url = editingTemplate ? `/api/templates/${editingTemplate.id}` : '/api/templates';
            const method = editingTemplate ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowModal(false);
                fetchTemplates();
            }
        } catch (e) {
            console.error('Failed to save template:', e);
        }
    };

    const handleDelete = async (template) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

        try {
            const res = await fetch(`/api/templates/${template.id}`, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });

            if (res.ok) {
                fetchTemplates();
            }
        } catch (e) {
            console.error('Failed to delete template:', e);
        }
    };

    const handleDuplicate = async (template) => {
        try {
            const res = await fetch(`/api/templates/${template.id}/duplicate`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });

            if (res.ok) {
                fetchTemplates();
            }
        } catch (e) {
            console.error('Failed to duplicate template:', e);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'article': return '📝';
            case 'email': return '📧';
            case 'social': return '📱';
            default: return '📄';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Templates" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden sm:rounded-xl">
                        <div className="p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600/20 to-amber-600/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    Templates
                                </h2>
                                <button
                                    onClick={handleCreate}
                                    className="gradient-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 shadow-lg shadow-indigo-600/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nouveau template
                                </button>
                            </div>

                            <TemplateCategoryFilter
                                selected={categoryFilter}
                                onChange={setCategoryFilter}
                            />

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {templates.length === 0 ? (
                                    <div className="col-span-full text-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400">Aucun template trouvé</p>
                                        <button onClick={handleCreate} className="text-indigo-400 hover:text-indigo-300 text-sm mt-2">
                                            Créer votre premier template →
                                        </button>
                                    </div>
                                ) : (
                                    filteredTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="glass-card rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{getCategoryIcon(template.category)}</div>
                                                    <div>
                                                        <h3 className="font-semibold text-white">{template.name}</h3>
                                                        <span className={`badge mt-1 ${
                                                            template.is_public
                                                                ? 'bg-green-500/20 text-green-300'
                                                                : 'bg-blue-500/20 text-blue-300'
                                                        }`}>
                                                            {template.is_public ? 'Public' : 'Personnel'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">
                                                {template.description || 'Aucune description'}
                                            </p>
                                            {template.variables?.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-1">
                                                    {template.variables.slice(0, 3).map((v) => (
                                                        <span key={v.name} className="px-2 py-0.5 bg-slate-700 text-gray-300 text-xs rounded-md">
                                                            {v.label}
                                                        </span>
                                                    ))}
                                                    {template.variables.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-slate-700 text-gray-400 text-xs rounded-md">
                                                            +{template.variables.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mt-4 pt-3 border-t border-white/5 flex gap-3">
                                                {!template.is_public && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(template)}
                                                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(template)}
                                                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Supprimer
                                                        </button>
                                                    </>
                                                )}
                                                {template.is_public && (
                                                    <button
                                                        onClick={() => handleDuplicate(template)}
                                                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Dupliquer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Modal */}
                            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingTemplate ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">
                                            {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
                                        </h3>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">Nom</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="input-dark"
                                                placeholder="Nom du template"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">Catégorie</label>
                                            <select
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                className="select-dark w-full"
                                            >
                                                <option value="article">📝 Article</option>
                                                <option value="email">📧 Email</option>
                                                <option value="social">📱 Réseaux sociaux</option>
                                                <option value="custom">📄 Personnalisé</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                rows={2}
                                                className="input-dark resize-none"
                                                placeholder="Brève description du template"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">System Prompt</label>
                                            <textarea
                                                value={form.system_prompt}
                                                onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
                                                rows={5}
                                                className="input-dark resize-none font-mono text-sm"
                                                placeholder="Instructions système pour l'IA..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">Variables (JSON)</label>
                                            <textarea
                                                value={form.variables}
                                                onChange={(e) => setForm({ ...form, variables: e.target.value })}
                                                rows={3}
                                                className="input-dark resize-none font-mono text-xs"
                                                placeholder='[{"name": "sujet", "label": "Sujet", "type": "text"}]'
                                            />
                                        </div>

                                        <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-white/5 cursor-pointer hover:bg-slate-700/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={form.is_public}
                                                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                                                className="rounded border-slate-600 bg-slate-700 text-indigo-500 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-gray-200">Rendre public</span>
                                                <p className="text-xs text-gray-400">Les autres utilisateurs pourront utiliser ce template</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-5 py-2.5 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-all duration-300 border border-slate-600"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="gradient-btn-secondary px-5 py-2.5 shadow-lg shadow-indigo-600/20"
                                        >
                                            {editingTemplate ? 'Enregistrer' : 'Créer'}
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}