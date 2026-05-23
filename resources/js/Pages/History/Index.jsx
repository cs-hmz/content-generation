import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ModelBadge from '@/Components/ModelBadge';

export default function History() {
    const [generations, setGenerations] = useState([]);
    const [meta, setMeta] = useState(null);
    const [filters, setFilters] = useState({ status: '', model: '' });
    const [loading, setLoading] = useState(true);

    const fetchGenerations = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page });
            if (filters.status) params.append('status', filters.status);
            if (filters.model) params.append('model', filters.model);

            const res = await fetch(`/api/generations?${params}`, {
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });
            const data = await res.json();
            setGenerations(data.data);
            setMeta(data.meta);
        } catch (e) {
            console.error('Failed to fetch generations:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, [filters]);

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            streaming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        const labels = {
            pending: 'En attente',
            streaming: 'En cours',
            completed: 'Terminé',
            failed: 'Échoué',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Historique" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-800/50 backdrop-blur border border-white/10 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 text-white">
                                Historique des générations
                            </h2>

                            {/* Filters */}
                            <div className="flex gap-4 mb-6">
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                    className="rounded-md bg-slate-700 border border-gray-600 text-gray-100 text-sm"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="pending">En attente</option>
                                    <option value="streaming">En cours</option>
                                    <option value="completed">Terminé</option>
                                    <option value="failed">Échoué</option>
                                </select>
                                <select
                                    value={filters.model}
                                    onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
                                    className="rounded-md bg-slate-700 border border-gray-600 text-gray-100 text-sm"
                                >
                                    <option value="">Tous les modèles</option>
                                    <option value="openai">GPT-4o</option>
                                    <option value="claude">Claude</option>
                                </select>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="text-center py-8 text-gray-400">Chargement...</div>
                            ) : generations.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    Aucune génération trouvée.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-slate-700/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Template</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Modèle</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tokens</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {generations.map((gen) => (
                                                <tr key={gen.id} className="hover:bg-slate-700/30">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {gen.template?.name || 'Prompt libre'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <ModelBadge model={gen.model} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {gen.tokens_used}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(gen.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {meta && meta.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => fetchGenerations(page)}
                                            className={`px-3 py-1 rounded text-sm ${
                                                page === meta.current_page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}