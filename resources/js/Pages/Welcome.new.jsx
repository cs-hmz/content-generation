import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="ContentGen - AI-Powered Content Generator" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
                {/* Animated background gradient */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                </div>

                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        {/* Header */}
                        <header className="flex items-center justify-between py-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                                    <span className="text-lg font-bold">✨</span>
                                </div>
                                <h1 className="text-2xl font-bold">ContentGen</h1>
                            </div>
                            <nav className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2 rounded-lg text-white hover:bg-white/10 transition"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Main Content */}
                        <main className="mt-20">
                            {/* Hero Section */}
                            <div className="text-center mb-20">
                                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                    Create Amazing Content
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                        in Minutes
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                    Harness the power of AI to generate high-quality content for your business. Faster, smarter, better.
                                </p>
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg"
                                    >
                                        Start Free Trial →
                                    </Link>
                                )}
                            </div>

                            {/* Features Grid */}
                            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                                {/* Feature 1 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                                    <p className="text-gray-300">
                                        Generate professional content in seconds, not hours. Powered by cutting-edge AI models.
                                    </p>
                                </div>

                                {/* Feature 2 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-2xl font-bold mb-4">Tailored Results</h3>
                                    <p className="text-gray-300">
                                        Customize AI outputs to match your brand voice and target audience perfectly.
                                    </p>
                                </div>

                                {/* Feature 3 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <h3 className="text-2xl font-bold mb-4">Scale Effortlessly</h3>
                                    <p className="text-gray-300">
                                        Create unlimited content without worrying about resources or manual effort.
                                    </p>
                                </div>

                                {/* Feature 4 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h3 className="text-2xl font-bold mb-4">Analytics Ready</h3>
                                    <p className="text-gray-300">
                                        Track performance metrics and optimize your content strategy with detailed insights.
                                    </p>
                                </div>

                                {/* Feature 5 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">🔐</div>
                                    <h3 className="text-2xl font-bold mb-4">Enterprise Secure</h3>
                                    <p className="text-gray-300">
                                        Your data is encrypted and protected with enterprise-grade security standards.
                                    </p>
                                </div>

                                {/* Feature 6 */}
                                <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-8 hover:bg-white/15 transition">
                                    <div className="text-4xl mb-4">🤝</div>
                                    <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
                                    <p className="text-gray-300">
                                        Work together seamlessly with built-in collaboration and approval workflows.
                                    </p>
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="mt-20 text-center">
                                <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur border border-purple-500/50 p-12">
                                    <h3 className="text-4xl font-bold mb-4">Ready to transform your content?</h3>
                                    <p className="text-xl text-gray-300 mb-8">Join thousands of creators and marketers using ContentGen</p>
                                    {!auth.user && (
                                        <Link
                                            href={route('register')}
                                            className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg"
                                        >
                                            Start Your Free Trial
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="py-12 text-center text-gray-400 text-sm border-t border-white/10 mt-20">
                            <p>© 2024 ContentGen. All rights reserved. Powered by AI.</p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
