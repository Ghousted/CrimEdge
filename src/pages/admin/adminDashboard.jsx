import React, { useState, useEffect } from 'react';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';

export default function AdminDashboard() {
  const { announcements, loading } = useHandleAnnouncements();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerRow(getCardsPerRow());
    };

    setCardsPerRow(getCardsPerRow());
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getCardsPerRow = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const handleMenuToggle = (announcementId) => {
    setOpenMenuId(openMenuId === announcementId ? null : announcementId);
  };

  const handleEdit = (announcementId) => {
    // Implement edit functionality here
    console.log('Edit announcement:', announcementId);
    setOpenMenuId(null); // Close the menu after action
  };

  const handleDelete = (announcementId) => {
    // Implement delete functionality here
    console.log('Delete announcement:', announcementId);
    setOpenMenuId(null); // Close the menu after action
  };

  const handleNext = () => {
    if ((currentPage + 1) * cardsPerRow < announcements.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIdx = currentPage * cardsPerRow;
  const endIdx = startIdx + cardsPerRow;
  const currentAnnouncements = announcements.slice(startIdx, endIdx);

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <div className="page-title mb-4 text-3xl font-bold text-gray-800">Admin Announcements</div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="prev-next-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          <i className="bi bi-arrow-left"></i> Previous
        </button>
        <button
          onClick={handleNext}
          disabled={endIdx >= announcements.length}
          className="prev-next-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
      <div className="announcement-list w-full">
        {loading ? (
          <p className="text-gray-600">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-600">No announcements available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white shadow-md p-6 rounded-lg border border-gray-200 relative hover:shadow-lg transition-shadow duration-300"
              >
            
                <p className="text-lg font-semibold">{announcement.announcement}</p>
                <p className="text-sm text-gray-600 mt-2">Target: {announcement.target}</p>
                <p className="text-sm text-gray-600 mt-1">By: {announcement.createdByName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
