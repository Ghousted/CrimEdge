import React from 'react';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';

export default function AdminDashboard() {
  const { announcements, loading } = useHandleAnnouncements();

  return (
    <section className="p-6">
      <div className="page-title mb-4 text-2xl">Admin Announcements</div>
      <div className="announcement-list max-w-4xl">
        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 border rounded-md bg-gray-50 mb-3">
              <p className="text-base">{announcement.announcement}</p>
              <p className="text-sm text-gray-600 mt-1">Target: {announcement.target}</p>
              <p className="text-sm text-gray-600 mt-1">By: {announcement.createdByName}</p>
              <p className="text-sm text-gray-600 mt-1">Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
