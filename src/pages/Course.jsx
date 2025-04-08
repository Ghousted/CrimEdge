import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const courses = [
  { id: 1, name: 'Course 1', lessons: 2, instructor: 'John Doe', description: 'Introduction to Course 1 with basic principles.' },
  { id: 2, name: 'Course 2', lessons: 4, instructor: 'Jane Smith', description: 'Intermediate concepts covered in Course 2.' },
  { id: 3, name: 'Course 3', lessons: 6, instructor: 'Bob Johnson', description: 'Advanced techniques and methodologies in Course 3.' },
  { id: 4, name: 'Course 4', lessons: 8, instructor: 'Alice Brown', description: 'Comprehensive coverage of all modules in Course 4.' },
  { id: 5, name: 'Course 5', lessons: 10, instructor: 'Mike Davis', description: 'Expert-level discussions and projects in Course 5.' },
];

const Course = () => {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));
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
    </section>
  );
};

export default Course;
