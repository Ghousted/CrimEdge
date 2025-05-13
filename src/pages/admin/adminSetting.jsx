import React, { useState } from 'react';
import { useEditAdminSettings } from '../../hooks/useEditAdminSettings';

const AdminSettings = () => {
    const { removePlan, editCurrentPlan, subscriptionPlans } = useEditAdminSettings();
    const [planName, setPlanName] = useState('');
    const [price, setPrice] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [error, setError] = useState('');

    const openModal = (plan) => {
        setSelectedPlan(plan);
        setPlanName(plan.plan);
        setPrice(plan.price);
        setShowModal(true);
        setError('');
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPlan(null);
        setPlanName('');
        setPrice(0);
        setError('');
    };

    const openDeleteModal = (plan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedPlan(null);
    };

    const handleDeletePlan = async () => {
        if (selectedPlan) {
            await removePlan(selectedPlan.id);
            closeDeleteModal();
        }
    };

    const handleEditPlan = async (id) => {
        if (!planName || !price) {
            setError('Both fields are required.');
            return;
        }
        await editCurrentPlan(id, planName, parseFloat(price));
        closeModal();
    };

    return (
        <section className='p-8 flex flex-col w-full bg-gray-50 min-h-screen'>
            <div className="max-w-7xl mx-auto w-full">
                <div className="page-title mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Subscription Plan Settings</h1>
                    <p className="text-gray-600 mt-2">Manage subscription plans and pricing</p>
                </div>

                {/* Plan List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Existing Plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(subscriptionPlans || []).map((plan) => (
                            <div key={plan.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-xl">{plan.plan}</p>
                                        <p className="text-lg font-medium text-blue-600 mt-1">₱{plan.price}<span className="text-sm text-gray-500">/month</span></p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => openModal(plan)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                        title="Edit this plan"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(plan)}
                                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                                        title="Delete this plan"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-md transform transition-all">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Plan</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                                <input
                                    type="text"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter plan name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter price"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                        </div>
                        <div className="flex justify-end mt-8 gap-3">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleEditPlan(selectedPlan.id)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-md transform transition-all">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Delete Plan</h2>
                        <p className="text-gray-600 text-center mb-8">
                            Are you sure you want to delete the plan <strong className="text-gray-900">{selectedPlan.plan}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePlan}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminSettings;