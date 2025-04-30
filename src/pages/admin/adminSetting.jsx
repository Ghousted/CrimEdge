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
        <section className='p-6 flex flex-col w-full'>
            <div className="page-title mb-4 text-2xl font-bold text-gray-800">Subscription Plan Settings</div>

            {/* Plan List */}
            <div className="">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Existing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(subscriptionPlans || []).map((plan) => (
                        <div key={plan.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div>
                                <p className="font-semibold text-gray-800 text-lg">{plan.plan}</p>
                                <p className="text-sm text-gray-600">₱{plan.price} / month</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => openModal(plan)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                    title="Edit this plan"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(plan)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    title="Delete this plan"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleEditPlan(selectedPlan.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Delete Plan</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the plan <strong>{selectedPlan.plan}</strong>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePlan}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminSettings;