import React, { useState } from 'react';
import { useEditAdminSettings } from '../../hooks/useEditAdminSettings';

const AdminSettings = () => {
    const { removePlan, editCurrentPlan, subscriptionPlans } = useEditAdminSettings();
    const [planName, setPlanName] = useState('');
    const [price, setPrice] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const openModal = (plan) => {
        setSelectedPlan(plan);
        setPlanName(plan.plan);
        setPrice(plan.price);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedPlan(null);
        setPlanName('');
        setPrice(0);
    };

    const handleDeletePlan = async (id) => {
        await removePlan(id);
    };

    const handleEditPlan = async (id) => {
        if (!planName || !price) return alert("Fill out both fields");
        await editCurrentPlan(id, planName, parseFloat(price));
        closeModal();
    };
    return (
        <section className='p-6 flex flex-col w-full'>
            <div className="page-title mb-4 text-2xl">Subscription Plan Settings</div>

            {/* Plan List */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Existing Plans</h2>
                <div className="space-y-4">
                    {(subscriptionPlans || []).map((plan) => (
                        <div key={plan.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
                            <div>
                                <p className="font-semibold">{plan.plan}</p>
                                <p className="text-sm text-gray-600">₱{plan.price} / month</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(plan)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                    Edit
                                </button>
                                <button onClick={() => handleDeletePlan(plan.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && selectedPlan && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border p-2 rounded"
                            />

                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={() => handleEditPlan(selectedPlan.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminSettings;
