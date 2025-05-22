import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../components/DarkModeContext';

export default function DownloadManagement() {
  const { darkMode } = useDarkMode();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const downloadsPerPage = 5;

  useEffect(() => {
    // Simulate fetching data
    const fetchDownloads = async () => {
      setLoading(true);
      try {
        // Dummy data
        const dummyData = [
          { id: '1', name: 'John Doe', email: 'john@example.com', lessonName: 'Introduction to React', lectureName: 'Component Basics', fileName: 'react-basics.pdf', size: '2.5 MB', downloadedAt: '2023-03-25' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', lessonName: 'Advanced JavaScript', lectureName: 'Closures', fileName: 'closures.pdf', size: '1.8 MB', downloadedAt: '2023-03-26' },
          { id: '3', name: 'Alice Johnson', email: 'alice@example.com', lessonName: 'CSS Fundamentals', lectureName: 'Flexbox', fileName: 'flexbox.pdf', size: '3.1 MB', downloadedAt: '2023-03-27' },
          { id: '4', name: 'Bob Brown', email: 'bob@example.com', lessonName: 'Node.js Basics', lectureName: 'Introduction', fileName: 'node-intro.pdf', size: '2.3 MB', downloadedAt: '2023-03-28' },
          { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', lessonName: 'Database Design', lectureName: 'Normalization', fileName: 'normalization.pdf', size: '2.7 MB', downloadedAt: '2023-03-29' },
          { id: '6', name: 'Diana Evans', email: 'diana@example.com', lessonName: 'Python Programming', lectureName: 'Data Structures', fileName: 'data-structures.pdf', size: '3.4 MB', downloadedAt: '2023-03-30' },
          { id: '7', name: 'Ethan Foster', email: 'ethan@example.com', lessonName: 'Machine Learning', lectureName: 'Introduction', fileName: 'ml-intro.pdf', size: '4.2 MB', downloadedAt: '2023-03-31' },
        ];
        setDownloads(dummyData);
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const filteredDownloads = downloads
    .filter(download =>
      Object.values(download).some(
        value => String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      const dateA = new Date(a.downloadedAt);
      const dateB = new Date(b.downloadedAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const indexOfLastDownload = currentPage * downloadsPerPage;
  const indexOfFirstDownload = indexOfLastDownload - downloadsPerPage;
  const currentDownloads = filteredDownloads.slice(indexOfFirstDownload, indexOfLastDownload);

  const totalPages = Math.ceil(filteredDownloads.length / downloadsPerPage);

  return (
    <section className="p-6 md:p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="page-title mb-8">
          <h1
            className={`text-3xl md:text-4xl ${
              darkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'
            }`}
          >
            Download Management
          </h1>
          <p
            className={`mt-2 ${
              darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'
            }`}
          >
            Manage and monitor download activities across the platform
          </p>
        </div>

        <div
          className={`rounded-lg shadow-md p-6 mb-6 border w-full ${
            darkMode ? 'bg-[#242526] border-[#3E4042]' : 'bg-[#f0f0f0] border-[#ccc]'
          }`}
        >
         <div className='flex items-center justify-between mb-4'>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by any field"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  darkMode
                    ? 'border-gray-600 bg-[#242526] text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-black placeholder-gray-500'
                }`}
              />
              <i
                className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: darkMode ? '#B0B3B8' : '#606770' }}
              ></i>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <label className={darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}>Sort Date by:</label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  darkMode
                    ? 'border-gray-600 bg-[#242526] text-white'
                    : 'border-gray-300 bg-white text-black'
                }`}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
         </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDownloads.length === 0 ? (
            <div className="text-center py-12">
              <i
                className="bi bi-file-earmark-arrow-down text-4xl"
                style={{ color: darkMode ? '#B0B3B8' : '#606770' }}
              ></i>
              <p className={darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}>
                No downloads found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      darkMode
                        ? 'bg-[#242526] border-gray-600 text-white hover:bg-[#3A3B3C]'
                        : 'bg-white border-gray-300 text-black hover:bg-gray-50'
                    }`}
                  >
                    <i className="bi bi-chevron-left"></i>
                    Previous
                  </button>
                  <span className={`font-medium ${darkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      darkMode
                        ? 'bg-[#242526] border-gray-600 text-white hover:bg-[#3A3B3C]'
                        : 'bg-white border-gray-300 text-black hover:bg-gray-50'
                    }`}
                  >
                    Next
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
                <span className={`text-sm ${darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                  Showing {currentDownloads.length} of {filteredDownloads.length} downloads
                </span>
              </div>

              <div
                className={`overflow-x-auto rounded-lg border w-full ${
                  darkMode ? 'border-[#3E4042]' : 'border-[#ccc]'
                }`}
              >
                <table className="min-w-full divide-y border-collapse">
                  <thead
                    className={`${darkMode ? 'bg-[#242526]' : 'bg-gray-50'}`}
                  >
                    <tr>
                      {['ID', 'Name', 'Email', 'Lesson Name', 'Lecture Name', 'File Name', 'Size', 'Downloaded At'].map(header => (
                        <th
                          key={header}
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border ${
                            darkMode
                              ? 'border-[#3E4042] text-[#B0B3B8]'
                              : 'border-[#ccc] text-[#65676B]'
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {currentDownloads.map(download => (
                      <tr
                        key={download.id}
                        className={`hover:transition-colors ${
                          darkMode ? 'hover:bg-[#3A3B3C]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.id}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.name}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.email}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.lessonName}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.lectureName}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.fileName}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {download.size}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border ${
                            darkMode
                              ? 'border-[#3E4042] text-white'
                              : 'border-[#ccc] text-black'
                          }`}
                        >
                          {new Date(download.downloadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
