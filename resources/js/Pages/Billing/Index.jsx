import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import QuotaBar from '@/Components/QuotaBar';

export default function Billing({ plans, currentPlan, used, limit }) {
    const handleSubscribe = async (planId) => {
        try {
            const res = await fetch('/billing/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
                body: JSON.stringify({ plan_id: planId }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            console.error('Subscription failed:', e);
        }
    };

    const handlePortal = async () => {
        try {
            const res = await fetch('/billing/portal', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1],
                },
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            console.error('Portal failed:', e);
        }
    };

    const getPlanBadge = (plan) => {
        if (currentPlan?.id === plan.id) return 'Actuel';
        if (plan.price_cents === 0) return 'Gratuit';
        return null;
    };

    const getPlanColor = (index) => {
        const colors = [
            { from: 'from-slate-600/20', to: 'to-slate-700/20', border: 'border-slate-500/30', gradient: 'from-slate-400 to-slate-500' },
            { from: 'from-indigo-600/20', to: 'to-purple-600/20', border: 'border-indigo-500/30', gradient: 'from-indigo-500 to-purple-600' },
            { from: 'from-purple-600/20', to: 'to-pink-600/20', border: 'border-purple-500/30', gradient: 'from-purple-500 to-pink-600' },
        ];
        return colors[index] || colors[0];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Abonnement" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Abonnement</h2>
                                <p className="text-gray-400 text-sm">Gérez votre abonnement et suivez votre consommation</p>
                            </div>
                        </div>
                        <QuotaBar used={used} limit={limit} />
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, index) => {
                            const isCurrentPlan = currentPlan?.id === plan.id;
                            const isFree = plan.price_cents === 0;
                            const colors = getPlanColor(index);

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative glass-card rounded-xl p-8 border-2 transition-all duration-300 ${
                                        isCurrentPlan
                                            ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
                                            : 'border-white/5 hover:border-indigo-500/50'
                                    }`}
                                >
                                    {/* Plan badge */}
                                    <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colors.gradient} text-white shadow-lg`}>
                                        {plan.name}
                                    </div>

                                    {isCurrentPlan && (
                                        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                            Plan actuel
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="mt-4 text-center">
                                        <div className="text-5xl font-extrabold text-white">
                                            {plan.price_cents > 0
                                                ? `${(plan.price_cents / 100).toFixed(0)}€`
                                                : (
                                                    <span className="text-3xl">Gratuit</span>
                                                )}
                                        </div>
                                        {plan.price_cents > 0 && (
                                            <div className="text-gray-400 mt-1">/ mois</div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="mt-8 space-y-4">
                                        <li className="flex items-start gap-3 text-sm text-gray-300">
                                            <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span><strong className="text-white">{plan.monthly_credits}</strong> crédits / mois</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-gray-300">
                                            <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tous les templates</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-gray-300">
                                            <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Export PDF / Markdown / DOCX</span>
                                        </li>
                                        {!isFree && (
                                            <li className="flex items-start gap-3 text-sm text-gray-300">
                                                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Priorité de génération</span>
                                            </li>
                                        )}
                                    </ul>

                                    {/* Action button */}
                                    <div className="mt-8">
                                        {isCurrentPlan ? (
                                            <button
                                                onClick={handlePortal}
                                                className="w-full px-4 py-3 bg-slate-700 text-gray-200 rounded-xl hover:bg-slate-600 transition-all duration-300 border border-slate-600 font-medium"
                                            >
                                                Gérer l'abonnement
                                            </button>
                                        ) : isFree ? (
                                            <div className="text-center text-sm text-gray-400">
                                                Actuellement gratuit
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSubscribe(plan.id)}
                                                className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg bg-gradient-to-r ${colors.gradient} text-white hover:shadow-xl hover:scale-[1.02]`}
                                            >
                                                S'abonner
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Portal link */}
                    {currentPlan && (
                        <div className="glass-card rounded-xl p-6 text-center">
                            <p className="text-gray-400 text-sm mb-3">
                                Besoin de gérer vos factures ou modifier votre méthode de paiement ?
                            </p>
                            <button
                                onClick={handlePortal}
                                className="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center gap-1 transition-colors"
                            >
                                Accéder au portail de facturation Stripe
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}