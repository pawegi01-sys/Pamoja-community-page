import React, { useState, useEffect } from 'react';
import { PRICING_PLANS, WHATSAPP_COMMUNITY_LINK } from './constants';
import type { PricingPlan } from './types';
import { initiatePayment } from './services/paymentService';
import Header from './components/Header';
import PricingCard from './components/PricingCard';
import AdminDashboard from './components/AdminDashboard';
import ShareButton from './components/ShareButton';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'admin'>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [julypayApiKey, setJulypayApiKey] = useState<string>('');
    const [whatsAppCommunityLink, setWhatsAppCommunityLink] = useState<string>(WHATSAPP_COMMUNITY_LINK);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatusParam = urlParams.get('payment_status');
        const planIdParam = urlParams.get('plan_id');

        if (paymentStatusParam === 'success') {
            const plan = PRICING_PLANS.find(p => p.id === planIdParam);
            setSelectedPlan(plan || null);
            setPaymentStatus('success');
            // Clean up URL to avoid re-triggering on refresh
            window.history.replaceState(null, '', window.location.pathname);
        } else if (paymentStatusParam === 'error' || paymentStatusParam === 'cancelled') {
            setPaymentStatus('error');
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, []);

    useEffect(() => {
        let redirectTimeout: number;

        if (paymentStatus === 'success') {
            // After a short delay, automatically open the WhatsApp link to simulate adding the user.
            redirectTimeout = window.setTimeout(() => {
                window.open(whatsAppCommunityLink, '_blank', 'noopener,noreferrer');
            }, 3000); // 3-second delay
        }

        // Cleanup the timeout if the component unmounts or status changes
        return () => {
            clearTimeout(redirectTimeout);
        };
    }, [paymentStatus, whatsAppCommunityLink]);


    const handleSelectPlan = async (plan: PricingPlan) => {
        setSelectedPlan(plan);
        setPaymentStatus('loading');
        try {
            const result = await initiatePayment(plan, julypayApiKey);
            if (result.success && result.checkoutUrl) {
                // In a real app, this redirects to Julypay.net.
                // Our simulation redirects back to this page with params to show the success modal.
                window.location.href = result.checkoutUrl;
            } else {
                console.error('Failed to get checkout URL:', result.error);
                setPaymentStatus('error');
            }
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus('error');
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setView('landing');
    };

    const handleApiKeySave = (apiKey: string) => {
        setJulypayApiKey(apiKey);
    };

    const handleWhatsAppLinkSave = (link: string) => {
        setWhatsAppCommunityLink(link);
    };

    if (view === 'admin') {
        if (isAuthenticated) {
            return (
                <AdminDashboard 
                    onLogout={handleLogout} 
                    julypayApiKey={julypayApiKey}
                    onSaveApiKey={handleApiKeySave}
                    whatsAppCommunityLink={whatsAppCommunityLink}
                    onSaveWhatsAppLink={handleWhatsAppLinkSave}
                />
            );
        }
        return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
    }

    return (
        <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
            <Header />

            <main>
                {/* Pricing Section */}
                <section id="pricing" className="bg-orange-100 py-20 md:py-28">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="flex justify-center items-center gap-4 mb-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Join Pamoja Community</h2>
                                <ShareButton />
                            </div>
                            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                                This community membership is currently meant for East African citizens. Purchase your membership and gain access to this community, a members-only Telegram channel, and a members-only WhatsApp community. Purchase now.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {PRICING_PLANS.map((plan) => (
                                <PricingCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* Payment Status Modal */}
            {(paymentStatus === 'loading' || paymentStatus === 'success' || paymentStatus === 'error') && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                        {paymentStatus === 'loading' && (
                            <>
                                <h3 className="text-2xl font-bold text-gray-900">Connecting to Gateway...</h3>
                                <p className="text-gray-600 mt-4">Please wait while we securely redirect you to Julypay.net to complete your purchase.</p>
                                <div className="mt-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                                </div>
                            </>
                        )}
                        {paymentStatus === 'success' && (
                            <>
                                <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
                                <p className="text-gray-600 mt-4">Welcome to the Pamoja Community! We are automatically adding you to our private WhatsApp group. Please check your device for the invitation.</p>
                                <div className="my-6 flex justify-center items-center text-gray-600">
                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-4"></div>
                                     <span>Redirecting to WhatsApp...</span>
                                </div>
                                <a href={whatsAppCommunityLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition duration-300">
                                    Open WhatsApp Manually
                                </a>
                                <button onClick={() => setPaymentStatus('idle')} className="mt-4 text-sm text-gray-500 hover:underline">Close</button>
                            </>
                        )}
                        {paymentStatus === 'error' && (
                            <>
                                <h3 className="text-2xl font-bold text-red-600">Payment Failed</h3>
                                <p className="text-gray-600 mt-4">Something went wrong. This could be due to a missing API key in the admin settings. Please try again or contact support.</p>
                                <button onClick={() => setPaymentStatus('idle')} className="mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition duration-300">
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <Footer onAdminClick={() => setView('admin')} />
        </div>
    );
};

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => (
    <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-gray-500">
            <div className="text-left mb-8 max-w-3xl mx-auto">
                <h4 className="font-semibold text-gray-800 mb-3 text-center md:text-left">Community Guidelines & Loan Information</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Requirements for a loan are any government issued document like national ID, passport or driving licence only.</li>
                    <li>There is zero interest on loans which is already covered by our charity organisations.</li>
                    <li>Solidarity and being respectful is expected in our community.</li>
                </ul>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center">
                 <p>&copy; {new Date().getFullYear()} Community Hub. All rights reserved.</p>
                 <div className="flex justify-center gap-4 mt-4 text-sm">
                   <a href="#" className="hover:text-orange-600">Privacy Policy</a>
                   <a href="#" className="hover:text-orange-600">Terms of Service</a>
                   <button onClick={onAdminClick} className="hover:text-orange-600">Admin Panel</button>
                 </div>
            </div>
        </div>
    </footer>
);


export default App;
