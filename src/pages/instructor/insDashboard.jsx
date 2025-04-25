import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [target, setTarget] = useState('All');
  const [announcement, setAnnouncement] = useState('');
  const [courseName, setCourseName] = useState('');
  const { id } = useParams();
  const courseId = id;

  const { createAnnouncement, announcements, createdAnnouncements, loading } = useHandleAnnouncements(courseId);
  const { addNewCourse, courses, loading: coursesLoading } = useHandleCourses();

  const handleAddAnnouncement = () => {
    createAnnouncement(announcement, target);
    setAnnouncement('');
    setTarget('All');
  };

  const handleAddCourse = () => {
    addNewCourse(courseName);
    setCourseName('');
  };

  return (
    <section className="w-4xl mx-auto py-5">
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
      </div>

      {/* Courses Section */}
{activeTab === 'courses' && (
  <>
    <div className="flex flex-col w-full gap-4">
      <div className="flex-1 p-5 rounded-md bg-white shadow-sm">
        <h2 className="text-xl mb-3">Add Course</h2>
        <div className="flex gap-4">
          <input
            type="text"
            required
            placeholder="Enter course name"
            className="w-4/5 p-2 border rounded-md"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <button
            onClick={handleAddCourse}
            className="w-1/5 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!courseName.trim()}
          >
            Add Course
          </button>
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-xl mb-3">Courses:</h2>
        {coursesLoading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">You have not created any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course-page/${course.id}`}
                className="p-4 shadow-md rounded-md bg-gray-50 hover:bg-gray-200 transition"
              >
                <p className="text-sm font-semibold">{course.course}</p>
                <p className="text-xs text-gray-500 mt-1">By: {course.createdByName}</p>
                <p className="text-xs text-gray-700 mt-2">{course.description}</p> {/* Add short description here */}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
)}


      {/* Announcements Section */}
{activeTab === 'announcements' && (
  <>
    <div className="flex flex-col w-full gap-4">
      <div className="flex-1 p-5 rounded-md bg-white shadow-sm">
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

      <div className="p-4 border rounded-md w-full bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Your Created Announcements</h2>
        {createdAnnouncements.length === 0 ? (
          <p className="text-gray-500">You have not created any announcements yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {createdAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 shadow-md rounded-md bg-gray-50 hover:bg-gray-200 transition">
                <p className="text-sm font-semibold">{announcement.announcement}</p>
                <p className="text-xs text-gray-500 mt-1">For: {announcement.target}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}
                </p>
                <p className="text-xs text-gray-500 mt-1">By: {announcement.createdByName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border rounded-md w-full bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Other Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {announcements
              .filter((a) => !createdAnnouncements.some((ca) => ca.id === a.id))
              .map((announcement) => (
                <div key={announcement.id} className="p-4 shadow-md rounded-md bg-gray-50 hover:bg-gray-200 transition">
                  <p className="text-sm font-semibold">{announcement.announcement}</p>
                  <p className="text-xs text-gray-500 mt-1">Target: {announcement.target}</p>
                  <p className="text-xs text-gray-500 mt-1">By: {announcement.createdBy}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  </>
)}

    </section>
  );
}
