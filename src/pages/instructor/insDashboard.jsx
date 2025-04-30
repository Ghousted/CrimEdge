import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [target, setTarget] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const { id } = useParams();
  const courseId = id;

  const { createAnnouncement, deleteAnnouncement, announcements, createdAnnouncements, loading, getAnnouncements } = useHandleAnnouncements(courseId);
  const { addNewCourse, courses, loading: coursesLoading } = useHandleCourses();

  const handleAddAnnouncement = () => {
    createAnnouncement(announcement, target);
    setAnnouncement('');
    setTarget('');
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    await deleteAnnouncement(announcementId);
    // Refresh announcements after deletion
    if (courseId) {
      getAnnouncements();
    }
  }

  const handleAddCourse = () => {
    addNewCourse(courseName, courseDescription);
    setCourseName('');
    setCourseDescription('');
  };

  return (
    <section className="max-w-7xl mx-auto py-5 px-4">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center sm:justify-start">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-200'} transition`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'bg-gray-200'} transition`}
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
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <input
                  type="text"
                  required
                  placeholder="Enter course code"
                  className="flex-1 p-2 border rounded-md"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="Enter course description"
                  className="flex-1 p-2 border rounded-md"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
                <button
                  onClick={handleAddCourse}
                  className="w-full sm:w-auto bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!courseName.trim() || !courseDescription.trim()}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/course-page/${course.id}`}
                      className="bg-white p-5 shadow-md rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className='flex flex-row items-center gap-2 justify-between border-b border-gray-300 pb-1'>
                        <p className="text-lg">{course.course}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(course.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="text-base text-gray-700 mt-2">{course.description}</p>
                      <p className="text-sm text-gray-700 mt-1">By: {course.createdByName}</p>

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
              <h2 className="text-xl mb-2">Add Announcement</h2>
              <textarea
                className="w-full p-1 h-24 border border-gray-500 rounded-md resize-none mb-1"
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
                  className="w-full p-2 border border-gray-500 rounded-md"
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
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!announcement.trim()}
              >
                Add Announcement
              </button>
            </div>

            <div className="w-full mt-4">
              <h2 className="text-xl mb-2">Your Created Announcements</h2>
              {createdAnnouncements.length === 0 ? (
                <p className="text-gray-500">You have not created any announcements yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {createdAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-5 shadow-md rounded-md bg-gray-50 hover:bg-gray-200 transition">
                      <div className='flex flex-row items-center gap-2 justify-between border-b border-gray-300 pb-1'>
                        <p className="text-lg">{announcement.announcement}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">For: {announcement.target}</p>
                      <p className="text-sm text-gray-700 mt-1">By: {announcement.createdByName}</p>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full mt-4">
              <h2 className="text-xl mb-2">Other Announcements</h2>
              {announcements.length === 0 ? (
                <p className="text-gray-500">No announcements available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {announcements
                    .filter((a) => !createdAnnouncements.some((ca) => ca.id === a.id))
                    .map((announcement) => (
                      <div key={announcement.id} className="p-5 bg-white shadow-md rounded-md bg-gray-50 hover:bg-gray-200 transition">
                        <div className='flex flex-row items-center gap-2 justify-between border-b border-gray-300 pb-1'>
                          <p className="text-lg">{announcement.announcement}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {announcement.createdAt && new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Target: {announcement.target}</p>
                        <p className="text-sm text-gray-700 mt-1">By: {announcement.createdByName}</p>
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
