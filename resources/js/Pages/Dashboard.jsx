import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import QuotaBar from '@/Components/QuotaBar';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalGenerations: 0,
        tokensUsed: 0,
        generationsThisMonth: 0,
        used: 0,
        limit: 100,
    });
    const [recentGenerations, setRecentGenerations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/dashboard', {
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });
            const data = await res.json();
            setStats(data.stats);
            setRecentGenerations(data.recentGenerations || []);
        } catch (e) {
            console.error('Failed to fetch dashboard data:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg p-8">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Bienvenue sur ContentGen 👋
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Générez du contenu de qualité avec nos modèles IA. Commencez maintenant!
                        </p>
                        <Link
                            href={route('generate')}
                            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                            Commencer → Générer
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Generations */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Générations totales</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {stats.totalGenerations}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tokens Used */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Tokens utilisés</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {(stats.tokensUsed / 1000).toFixed(1)}K
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* This Month */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Ce mois</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {stats.generationsThisMonth}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quota Bar */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Vos crédits</h3>
                        <QuotaBar used={stats.used} limit={stats.limit} />
                        <Link
                            href={route('billing.index')}
                            className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block"
                        >
                            Voir les plans d'abonnement →
                        </Link>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href={route('generate')}
                            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Générer du contenu</h4>
                                    <p className="text-gray-400 text-sm">Créer une nouvelle génération</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('history')}
                            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Historique</h4>
                                    <p className="text-gray-400 text-sm">Voir vos générations passées</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('templates')}
                            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Templates</h4>
                                    <p className="text-gray-400 text-sm">Gérer vos templates</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('billing.index')}
                            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Abonnement</h4>
                                    <p className="text-gray-400 text-sm">Voir vos plans</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
