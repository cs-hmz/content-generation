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
        const config = {
            pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400', label: 'En attente' },
            streaming: { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-400', label: 'En cours' },
            completed: { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400', label: 'Terminé' },
            failed: { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400', label: 'Échoué' },
        };
        const c = config[status] || { bg: 'bg-gray-500/20', text: 'text-gray-300', dot: 'bg-gray-400', label: status };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                {c.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Historique" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden sm:rounded-xl">
                        <div className="p-6 lg:p-8">
                            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Historique des générations
                            </h2>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                        className="select-dark pl-9 pr-8"
                                    >
                                        <option value="">Tous les statuts</option>
                                        <option value="pending">En attente</option>
                                        <option value="streaming">En cours</option>
                                        <option value="completed">Terminé</option>
                                        <option value="failed">Échoué</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <select
                                        value={filters.model}
                                        onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
                                        className="select-dark pl-9 pr-8"
                                    >
                                        <option value="">Tous les modèles</option>
                                        <option value="openai">GPT-4o</option>
                                        <option value="claude">Claude</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="skeleton h-16 w-full rounded-lg"></div>
                                    ))}
                                </div>
                            ) : generations.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400">Aucune génération trouvée.</p>
                                    <Link href={route('generate')} className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                                        Commencer à générer →
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-white/5">
                                    <table className="min-w-full divide-y divide-white/5">
                                        <thead>
                                            <tr className="bg-slate-700/30">
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Template</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modèle</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tokens</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {generations.map((gen) => (
                                                <tr key={gen.id} className="hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {gen.template?.name || (
                                                            <span className="text-gray-500 italic">Prompt libre</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <ModelBadge model={gen.model} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            {gen.tokens_used || 0}
                                                        </div>
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
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => fetchGenerations(meta.current_page - 1)}
                                        disabled={meta.current_page <= 1}
                                        className="px-3 py-2 rounded-lg text-sm bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => fetchGenerations(page)}
                                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                page === meta.current_page
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => fetchGenerations(meta.current_page + 1)}
                                        disabled={meta.current_page >= meta.last_page}
                                        className="px-3 py-2 rounded-lg text-sm bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}