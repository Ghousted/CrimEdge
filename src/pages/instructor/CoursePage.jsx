import React, { useState } from 'react';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useParams } from 'react-router-dom';

export default function CoursePage() {
  const { id } = useParams();
  
  const [target, setTarget] = useState('Free');
  const [announcement, setAnnouncement] = useState('');
  const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, loading } = useHandleCourses();
  

  const course = courses.find(c => c.id === id) || null;
  
  const handleAddAnnouncement = () => {
    if (announcement.trim() === '') return;
    createAnnouncement(announcement, course.course, course.id);
    setAnnouncement('');
    setTarget('Free');
  };

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto py-5 px-4">
      <h1 className="text-2xl font-bold mb-2">{course.course}</h1>
      <p className="mb-4 text-gray-600 text-lg">Created by: {course.createdByName}</p>

      {/* Add Announcement */}
      <div className="announcement-section p-4 rounded-md bg-white shadow-sm">
        <h2 className="text-lg mb-2">Add Announcement for this Course</h2>
        <textarea
          className="w-full p-2 border border-gray-300 h-24 rounded-md resize-none mb-3"
          rows={4}
          placeholder="Write your announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <button
          onClick={handleAddAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="announcements-list mt-6">
        <h2 className="text-xl mb-2">Announcements</h2>
        {createdAnnouncements.length === 0 ? (
          <p className="text-gray-500">No announcements for this course yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-white rounded-md bg-gray-50 shadow-sm ">
                <div className="flex flex-row justify-between items-center mb-2 border-b border-gray-300 pb-1">
                <p className="text-lg">{announcement.announcement}</p>
                <p className="text-xs text-gray-500">
                  {announcement.createdAt
                    ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </p>
                </div>

                <p className="text-sm text-gray-700 mt-2">Target: {announcement.target}</p>
                
              </div>
            ))}
          </div>
  )}
</div>

    </section>
  );
}
