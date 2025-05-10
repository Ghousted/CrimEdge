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

  // Helper function for date formatting
  function formatDateDot(dateObj) {
    const d = new Date(dateObj.seconds * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return (
    <section className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Admin Announcements
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="prev-next-btn px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <i className="bi bi-arrow-left"></i> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={endIdx >= announcements.length}
              className="prev-next-btn px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              Next <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="announcement-list w-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No announcements available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white shadow p-6 rounded-2xl border border-gray-100 relative transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-medium">By {announcement.createdByName}</span>
                    <span className="text-sm text-gray-400 font-medium">
                      {announcement.createdAt
                        ? formatDateDot(announcement.createdAt)
                        : ''}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-lg text-blue-500 ">Target: {announcement.target}</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-base text-gray-800 leading-snug">{announcement.announcement}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
