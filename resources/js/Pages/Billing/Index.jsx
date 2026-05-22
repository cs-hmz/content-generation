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

    return (
        <AuthenticatedLayout>
            <Head title="Abonnement" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Quota bar */}
                    <div className="mb-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <QuotaBar used={used} limit={limit} />
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const isCurrentPlan = currentPlan?.id === plan.id;
                            const isFree = plan.price_cents === 0;

                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-2 ${
                                        isCurrentPlan
                                            ? 'border-indigo-500'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {plan.name}
                                    </h3>
                                    <div className="mt-4">
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                                            {plan.price_cents > 0
                                                ? `${(plan.price_cents / 100).toFixed(0)}€`
                                                : 'Gratuit'}
                                        </span>
                                        {plan.price_cents > 0 && (
                                            <span className="text-gray-500 dark:text-gray-400">/mois</span>
                                        )}
                                    </div>
                                    <ul className="mt-6 space-y-3">
                                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {plan.monthly_credits} crédits / mois
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Tous les templates
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Export PDF / Markdown / DOCX
                                        </li>
                                    </ul>
                                    <div className="mt-8">
                                        {isCurrentPlan ? (
                                            <button
                                                onClick={handlePortal}
                                                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                            >
                                                Gérer l'abonnement
                                            </button>
                                        ) : isFree ? (
                                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                                Plan actuel
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSubscribe(plan.id)}
                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                S'abonner
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {currentPlan && (
                        <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <button
                                onClick={handlePortal}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
                            >
                                Accéder au portail de facturation Stripe →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}