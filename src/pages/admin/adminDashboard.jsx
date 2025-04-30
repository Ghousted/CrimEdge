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
    <section className="p-6">
      <div className="page-title mb-4 text-2xl">Admin Announcements</div>
      <div className="flex justify-between mb-4">
        <button onClick={handlePrev} disabled={currentPage === 0} className="prev-next-btn">
          <i className='bi bi-arrow-left's></i>
        </button>
        <button onClick={handleNext} disabled={endIdx >= announcements.length} className="prev-next-btn">
          <i className='bi bi-arrow-right's></i>
        </button>
      </div>
      <div className="announcement-list w-full">
        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {currentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white shadow-lg  p-4 rounded-md bg-gray-50 relative">
                <button
                  onClick={() => handleMenuToggle(announcement.id)}
                  className="absolute top-2 right-2 text-gray-600"
                >
                  ⋮
                </button>
                {openMenuId === announcement.id && (
                  <div className="absolute top-8 right-2 bg-white rounded shadow-xl z-10">
                    <button
                      onClick={() => handleEdit(announcement.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <p className="text-base">{announcement.announcement}</p>
                <p className="text-sm text-gray-600 mt-1">Target: {announcement.target}</p>
                <p className="text-sm text-gray-600 mt-1">By: {announcement.createdByName}</p>
                <p className="text-sm text-gray-600 mt-1">Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    
    </section>
  );
}
