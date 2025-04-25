import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';

export default function InstructorDashboard() {
  const [target, setTarget] = useState('All');
  const [announcement, setAnnouncement] = useState('');
  const { id } = useParams();
  const courseId = id;
  const { createAnnouncement, announcements, createdAnnouncements, loading } = useHandleAnnouncements(courseId);
  const { addNewCourse, courses, loading: coursesLoading } = useHandleCourses();
  const [courseName, setCourseName] = useState('');

  const handleAddAnnouncement = () => {
    createAnnouncement(announcement, target);
    setAnnouncement('');
    setTarget('All');
  };

  const handleAddCourse = () => {
    addNewCourse(courseName);
    setCourseName('');
  }

  return (
    <section className="p-6 flex flex-col gap-6">
      {/* Add Announcement */}
      <div className="announcement-section p-4 border rounded-md w-full max-w-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Add Announcement</h2>
        <textarea
          className="w-full p-2 border rounded-md resize-none mb-3"
          rows={4}
          placeholder="Write your announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          required
        />
        <div className="mb-3">
          <label htmlFor="audience" className="block mb-1 font-medium">Target Audience</label>
          <select
            id="audience"
            className="w-full p-2 border rounded-md"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Basic Plan">Basic Plan</option>
            <option value="Premium Plan">Premium Plan</option>
          </select>
        </div>
        <button
          onClick={handleAddAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!announcement.trim()}
        >
          Add Announcement
        </button>
      </div>

      {/* Subjects Section */}
      <div className="subjects-section p-4 border rounded-md w-full max-w-lg bg-white shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-3">Add Course</h2>
        <input
          type="text"
          required
          placeholder="Enter course name"
          className="w-full p-2 border rounded-md mb-3"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <button
          onClick={handleAddCourse}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!courseName.trim()}
        >
          Add Course
        </button>
      </div>

      {/* Courses List Section */}
      <div className="courses-section p-4 border rounded-md w-full max-w-lg bg-white shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Courses</h2>
        {coursesLoading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">You have not created any courses yet.</p>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              to={`/course-page/${course.id}`}
              className="p-2 border rounded-md bg-gray-50 mb-2 block hover:bg-gray-100"
            >
              <p className="text-sm">{course.course}</p>
              <p className="text-xs text-gray-500 mt-1">By: {course.createdByName}</p>
            </Link>
          ))
        )}
      </div>

      {/* Created Announcements */}
      <div className="announcement-section p-4 border rounded-md w-full max-w-lg bg-white shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Created Announcements</h2>
        {createdAnnouncements.length === 0 ? (
          <p className="text-gray-500">You have not created any announcements yet.</p>
        ) : (
          createdAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-2 border rounded-md bg-gray-50 mb-2">
              <p className="text-sm">{announcement.announcement}</p>
              <p className="text-xs text-gray-500 mt-1">For: {announcement.target}</p>
              <p className="text-xs text-gray-500 mt-1">
                Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">By: {announcement.createdByName}</p>
            </div>
          ))
        )}
      </div>

      {/* Other Announcements */}
      <div className="announcement-section p-4 border rounded-md w-full max-w-lg bg-white shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-3">Other Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          announcements
            .filter((a) => !createdAnnouncements.some((ca) => ca.id === a.id))
            .map((announcement) => (
              <div key={announcement.id} className="p-2 border rounded-md bg-gray-50 mb-2">
                <p className="text-sm">{announcement.announcement}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {announcement.target}</p>
                <p className="text-xs text-gray-500 mt-1">By: {announcement.createdBy}</p>
              </div>
            ))
        )}
      </div>
    </section>
  );
}
