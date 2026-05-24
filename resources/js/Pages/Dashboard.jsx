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

    const statCards = [
        {
            label: 'Générations totales',
            value: stats.totalGenerations,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'from-blue-600/20 to-blue-700/20',
            iconColor: 'text-blue-400',
        },
        {
            label: 'Tokens utilisés',
            value: `${(stats.tokensUsed / 1000).toFixed(1)}K`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-600/20 to-emerald-700/20',
            iconColor: 'text-green-400',
        },
        {
            label: 'Ce mois',
            value: stats.generationsThisMonth,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-purple-600/20 to-pink-700/20',
            iconColor: 'text-purple-400',
        },
    ];

    const quickActions = [
        {
            href: route('generate'),
            label: 'Générer du contenu',
            description: 'Créer une nouvelle génération',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            color: 'from-indigo-600/20 to-blue-700/20',
            iconColor: 'text-indigo-400',
        },
        {
            href: route('history'),
            label: 'Historique',
            description: 'Voir vos générations passées',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-600/20 to-emerald-700/20',
            iconColor: 'text-green-400',
        },
        {
            href: route('templates'),
            label: 'Templates',
            description: 'Gérer vos templates',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'from-orange-600/20 to-amber-700/20',
            iconColor: 'text-orange-400',
        },
        {
            href: route('billing.index'),
            label: 'Abonnement',
            description: 'Voir vos plans',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-purple-600/20 to-pink-700/20',
            iconColor: 'text-purple-400',
        },
    ];

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
                    {loading ? (
                        <div className="glass-card rounded-xl p-8">
                            <div className="skeleton h-8 w-64 mb-2"></div>
                            <div className="skeleton h-4 w-96 mb-4"></div>
                            <div className="skeleton h-10 w-40"></div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-indigo-500/30 p-8">
                            {/* Decorative gradient orb */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Bienvenue sur ContentGen 👋
                                </h3>
                                <p className="text-gray-300 mb-6 max-w-xl">
                                    Générez du contenu de qualité avec nos modèles IA. Commencez maintenant!
                                </p>
                                <Link
                                    href={route('generate')}
                                    className="gradient-btn-secondary inline-flex items-center gap-2 px-6 py-3 shadow-lg shadow-indigo-600/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Commencer → Générer
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="glass-card rounded-xl p-6">
                                    <div className="skeleton h-4 w-24 mb-3"></div>
                                    <div className="skeleton h-8 w-20"></div>
                                </div>
                            ))
                        ) : (
                            statCards.map((stat, index) => (
                                <div
                                    key={index}
                                    className="glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                            <p className="text-3xl font-bold text-white mt-2">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <span className={stat.iconColor}>{stat.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Quota Bar & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Quota Bar */}
                        <div className="glass-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Vos crédits
                            </h3>
                            {loading ? (
                                <div className="space-y-3">
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-2.5 w-full rounded-full"></div>
                                </div>
                            ) : (
                                <>
                                    <QuotaBar used={stats.used} limit={stats.limit} />
                                    <Link
                                        href={route('billing.index')}
                                        className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-flex items-center gap-1 transition-colors"
                                    >
                                        Voir les plans d'abonnement
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activité récente
                            </h3>
                            {loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="skeleton h-12 w-full rounded-lg"></div>
                                    ))}
                                </div>
                            ) : recentGenerations.length > 0 ? (
                                <div className="space-y-2">
                                    {recentGenerations.slice(0, 5).map((gen) => (
                                        <div key={gen.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    gen.status === 'completed' ? 'bg-green-400' :
                                                    gen.status === 'failed' ? 'bg-red-400' :
                                                    gen.status === 'streaming' ? 'bg-blue-400' :
                                                    'bg-yellow-400'
                                                }`}></div>
                                                <span className="text-sm text-gray-300">
                                                    {gen.template?.name || 'Prompt libre'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-6">
                                    Aucune activité récente
                                </p>
                            )}
                            {recentGenerations.length > 0 && (
                                <Link
                                    href={route('history')}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-flex items-center gap-1 transition-colors"
                                >
                                    Voir tout l'historique
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="glass-card rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all duration-300 group"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <span className={action.iconColor}>{action.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{action.label}</h4>
                                            <p className="text-gray-400 text-sm mt-0.5">{action.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}