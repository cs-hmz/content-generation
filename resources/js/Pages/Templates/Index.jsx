import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TemplateCategoryFilter from '@/Components/TemplateCategoryFilter';

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

    const filteredTemplates = categoryFilter
        ? templates.filter((t) => t.category === categoryFilter)
        : templates;

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

    return (
        <AuthenticatedLayout>
            <Head title="Templates" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Templates
                                </h2>
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Nouveau template
                                </button>
                            </div>

                            <TemplateCategoryFilter
                                selected={categoryFilter}
                                onChange={setCategoryFilter}
                            />

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {template.name}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                                                    template.is_public
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                }`}>
                                                    {template.is_public ? 'Public' : 'Personnel'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {template.description}
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            {!template.is_public && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(template)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(template)}
                                                        className="text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </>
                                            )}
                                            {template.is_public && (
                                                <button
                                                    onClick={() => handleDuplicate(template)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Dupliquer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                                            {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
                                                <select
                                                    value={form.category}
                                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="article">Article</option>
                                                    <option value="email">Email</option>
                                                    <option value="social">Réseaux sociaux</option>
                                                    <option value="custom">Personnalisé</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                                <textarea
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                    rows={2}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Prompt</label>
                                                <textarea
                                                    value={form.system_prompt}
                                                    onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
                                                    rows={4}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variables (JSON)</label>
                                                <textarea
                                                    value={form.variables}
                                                    onChange={(e) => setForm({ ...form, variables: e.target.value })}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 font-mono text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder='[{"name": "sujet", "label": "Sujet", "type": "text"}]'
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={form.is_public}
                                                    onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rendre public</label>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            >
                                                {editingTemplate ? 'Enregistrer' : 'Créer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}