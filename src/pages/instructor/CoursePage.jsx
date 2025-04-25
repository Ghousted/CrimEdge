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
    <section className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.course}</h1>
      <p className="mb-6">Created by: {course.createdByName}</p>

      {/* Add Announcement */}
      <div className="announcement-section p-4 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Add Announcement for this Course</h2>
        <textarea
          className="w-full p-2 border rounded-md resize-none mb-3"
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
        <h2 className="text-xl font-semibold mb-3">Announcements</h2>
        {createdAnnouncements.length === 0 ? (
          <p className="text-gray-500">No announcements for this course yet.</p>
        ) : (
          createdAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-2 border rounded-md bg-gray-50 mb-2">
              <p className="text-sm">{announcement.announcement}</p>
              <p className="text-xs text-gray-500 mt-1">Target: {announcement.target}</p>
              <p className="text-xs text-gray-500 mt-1">
                Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
