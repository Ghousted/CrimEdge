import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements'; // Import your hook


const Course = () => {
  const { id } = useParams();
  const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses } = useHandleCourses(); // Get courses from hook

  const course = courses.find(c => c.id === id) || null;

  const [activeSection, setActiveSection] = useState('lessons');

  if (!course) {
    return <div className="p-6 text-center text-red-500">Course not found.</div>;
  }

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <section className="p-6">
      {/* Header with section buttons */}
      <div className="w-full flex gap-5 bg-white shadow-md py-2 px-4 rounded-lg justify-start mb-4">
        <div
          className={`cursor-pointer relative ${activeSection === 'lessons' ? 'active-underline' : ''}`}
          onClick={() => handleSectionClick('lessons')}
        >
          Lessons
        </div>
        <div
          className={`cursor-pointer relative ${activeSection === 'quizzes' ? 'active-underline' : ''}`}
          onClick={() => handleSectionClick('quizzes')}
        >
          Quizzes
        </div>
        <div
          className={`cursor-pointer relative ${activeSection === 'workload' ? 'active-underline' : ''}`}
          onClick={() => handleSectionClick('workload')}
        >
          Workload
        </div>
      </div>

      {/* Render sections based on active state */}
      {activeSection === 'lessons' && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg">Lessons</h2>
          <p>{course.description}</p>
          <p>Number of lessons: {course.lessons}</p>
        </div>
      )}

      {activeSection === 'quizzes' && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg">Quizzes</h2>
          <p>Quizzes section content here.</p>
        </div>
      )}

      {activeSection === 'workload' && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg">Workload</h2>
          <p>Workload section content here.</p>
        </div>
      )}

      {/* Announcements Section */}
      <div className="announcements-section mt-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Announcements for {course.course}</h2>
        <p className="mb-2 text-sm text-gray-600">Instructor: {course.createdByName}</p>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements for this course yet.</p>
        ) : (
          announcements.map((announcement) => (
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
};

export default Course;
