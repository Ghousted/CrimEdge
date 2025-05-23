import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useDarkMode } from '../../components/DarkModeContext';

export default function UserManagement() {
  const { darkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter(user => roleFilter === 'All' || user.role === roleFilter.toLowerCase())
    .filter(user =>
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <section className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="page-title mb-8">
          <h1
            className={`text-3xl md:text-4xl  ${
              darkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'
            }`}
          >
            User Management
          </h1>
          <p
            className={`mt-2 ${
              darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'
            }`}
          >
            Manage and monitor user accounts across the platform
          </p>
        </div>

        <div
          className={`rounded-lg shadow-md p-6 mb-6 border
            ${darkMode ? 'bg-[#242526] border-[#3E4042]' : 'bg-[#f0f0f0] border-[#ccc]'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${
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
            <div className="flex items-center">
              <label
                htmlFor="roleFilter"
                className={`mr-2 font-medium ${
                  darkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'
                }`}
              >
                Filter by Role:
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${
                    darkMode
                      ? 'border-gray-600 bg-[#242526] text-white'
                      : 'border-gray-300 bg-white text-black'
                  }`}
              >
                <option>All</option>
                <option>Admin</option>
                <option>User</option>
                <option>Instructor</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <i
                className="bi bi-people text-4xl"
                style={{ color: darkMode ? '#B0B3B8' : '#606770' }}
              ></i>
              <p className={darkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}>
                No users found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all
                      ${
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
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all
                      ${
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
                  Showing {currentUsers.length} of {filteredUsers.length} users
                </span>
              </div>

              <div
                className={`overflow-x-auto rounded-lg border ${
                  darkMode ? 'border-[#3E4042]' : 'border-[#ccc]'
                }`}
              >
                <table className="min-w-full divide-y border-collapse">
                  <thead
                    className={`${darkMode ? 'bg-[#242526]' : 'bg-gray-50'}`}
                  >
                    <tr>
                      {['ID', 'Name', 'Email', 'Role'].map(header => (
                        <th
                          key={header}
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border
                            ${
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
                    {currentUsers.map(user => (
                      <tr
                        key={user.id}
                        className={`hover:transition-colors ${
                          darkMode ? 'hover:bg-[#3A3B3C]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm border
                            ${
                              darkMode
                                ? 'border-[#3E4042] text-white'
                                : 'border-[#ccc] text-black'
                            }`}
                        >
                          {user.id}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border
                            ${
                              darkMode
                                ? 'border-[#3E4042] text-white'
                                : 'border-[#ccc] text-black'
                            }`}
                        >
                          {user.firstName} {user.lastName}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border
                            ${
                              darkMode
                                ? 'border-[#3E4042] text-white'
                                : 'border-[#ccc] text-black'
                            }`}
                        >
                          {user.email}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap border capitalize
                            ${
                              darkMode
                                ? 'border-[#3E4042] text-white'
                                : 'border-[#ccc] text-black'
                            }`}
                        >
                          {user.role}
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
