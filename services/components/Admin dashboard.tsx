import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_MEMBERS, PRICING_PLANS } from '../constants';
import type { Member } from '../types';
import { UserGroupIcon, BanknotesIcon, TrashIcon } from './icons/Icons';

interface AdminDashboardProps {
    onLogout: () => void;
    julypayApiKey: string;
    onSaveApiKey: (apiKey: string) => void;
    whatsAppCommunityLink: string;
    onSaveWhatsAppLink: (link: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout,
    julypayApiKey,
    onSaveApiKey,
    whatsAppCommunityLink,
    onSaveWhatsAppLink
}) => {
    const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');
    const [planFilter, setPlanFilter] = useState<string>('All');
    const [webhookUrlCopied, setWebhookUrlCopied] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(julypayApiKey);
    const [apiKeySaved, setApiKeySaved] = useState(false);
    const [whatsAppLinkInput, setWhatsAppLinkInput] = useState(whatsAppCommunityLink);
    const [whatsAppLinkSaved, setWhatsAppLinkSaved] = useState(false);


    const webhookUrl = 'https://your-app.com/api/webhooks/julypay';

    useEffect(() => {
        const today = new Date();
        // To compare dates only, reset the time part of today's date
        today.setHours(0, 0, 0, 0);

        const updatedMembers = members.map(member => {
            const expiryDate = new Date(member.expiryDate);
            if (expiryDate < today && member.status === 'Active') {
                return { ...member, status: 'Expired' as 'Expired' };
            }
            return member;
        });

        // Check if there are any changes to avoid an infinite loop if members were a dependency
        if (JSON.stringify(updatedMembers) !== JSON.stringify(members)) {
             setMembers(updatedMembers);
        }
    }, []); // Run only once on component mount

    const handleRemoveMember = (id: number) => {
        if (window.confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
            setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        }
    };

    const handleCopyWebhookUrl = () => {
        navigator.clipboard.writeText(webhookUrl).then(() => {
            setWebhookUrlCopied(true);
            setTimeout(() => setWebhookUrlCopied(false), 2000);
        });
    };
    
    const handleApiKeyFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveApiKey(apiKeyInput);
        setApiKeySaved(true);
        setTimeout(() => setApiKeySaved(false), 2500);
    };

    const handleWhatsAppLinkFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveWhatsAppLink(whatsAppLinkInput);
        setWhatsAppLinkSaved(true);
        setTimeout(() => setWhatsAppLinkSaved(false), 2500);
    };

    const analytics = useMemo(() => {
        const activeMembers = members.filter(m => m.status === 'Active');
        const totalRevenue = members.reduce((acc, member) => {
            const plan = PRICING_PLANS.find(p => p.id === member.planId);
            return acc + (plan ? plan.price : 0);
        }, 0);

        return {
            totalMembers: members.length,
            activeMembers: activeMembers.length,
            totalRevenue: totalRevenue,
        };
    }, [members]);

    const filteredMembers = useMemo(() => {
        return members
            .filter(member => {
                if (statusFilter === 'All') return true;
                return member.status === statusFilter;
            })
            .filter(member => {
                if (planFilter === 'All') return true;
                return member.planId === planFilter;
            });
    }, [members, statusFilter, planFilter]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={onLogout}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Analytics Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Analytics Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                    <UserGroupIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Members</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalMembers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <UserGroupIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Active Members</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.activeMembers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                             <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <BanknotesIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">UGX {analytics.totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Settings Section */}
                <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Webhook Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Webhook Integration</h3>
                        <div>
                            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700">
                                Julypay Webhook URL
                            </label>
                            <p className="text-xs text-gray-500 mb-1">Add this URL to your Julypay account for payment notifications.</p>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="webhook-url"
                                    value={webhookUrl}
                                    readOnly
                                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-gray-100 sm:text-sm"
                                />
                                <button
                                    onClick={handleCopyWebhookUrl}
                                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                >
                                    <span>{webhookUrlCopied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                     {/* API Key Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">API Configuration</h3>
                        <form onSubmit={handleApiKeyFormSubmit}>
                            <div>
                                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                                    Julypay API Key
                                </label>
                                <p className="text-xs text-gray-500 mb-1">Your secret API key for processing payments.</p>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        id="api-key"
                                        value={apiKeyInput}
                                        onChange={(e) => setApiKeyInput(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        placeholder="sk_live_******************"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                                {apiKeySaved && <span className="text-sm text-green-600 mr-4">API Key saved!</span>}
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Save Key
                                </button>
                            </div>
                        </form>
                    </div>
                     {/* WhatsApp Link Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Community Link</h3>
                        <form onSubmit={handleWhatsAppLinkFormSubmit}>
                            <div>
                                <label htmlFor="whatsapp-link" className="block text-sm font-medium text-gray-700">
                                    WhatsApp Community Link
                                </label>
                                <p className="text-xs text-gray-500 mb-1">Members will be redirected here after payment.</p>
                                <div className="mt-1">
                                    <input
                                        type="url"
                                        id="whatsapp-link"
                                        value={whatsAppLinkInput}
                                        onChange={(e) => setWhatsAppLinkInput(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        placeholder="https://chat.whatsapp.com/..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                                {whatsAppLinkSaved && <span className="text-sm text-green-600 mr-4">Link saved!</span>}
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Save Link
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Members Table */}
                <section className="mt-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Member Management</h2>
                        <div className="flex items-center gap-4">
                            <div>
                                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                                <select 
                                    id="status-filter"
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Expired')}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="plan-filter" className="sr-only">Filter by plan</label>
                                <select
                                    id="plan-filter"
                                    value={planFilter}
                                    onChange={(e) => setPlanFilter(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                                >
                                    <option value="All">All Plans</option>
                                    {PRICING_PLANS.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Telephone Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{member.telephoneNumber}</div>
                                            <div className="text-sm text-gray-500">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{member.planName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{member.expiryDate}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleRemoveMember(member.id)} className="text-red-600 hover:text-red-900 transition-colors">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {filteredMembers.length === 0 && <p className="text-center py-8 text-gray-500">No members match the current filters.</p>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
