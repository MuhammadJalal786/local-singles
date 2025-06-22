import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from "../../api";
import { Menu } from '@headlessui/react';

export default function UserManagement() {
  const [users, setUsers]         = useState([]);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState('');
  const observer = useRef();

  // Fetch users
  const fetchUsers = async (p = 1, append = false) => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users', {
        params: { page: p, limit: 20, search }
      });
      const { users: data, totalPages } = res.data;
      setUsers(prev => append ? [...prev, ...data] : data);
      setHasMore(p < totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Initial & search effect
  useEffect(() => {
    setPage(1);
    fetchUsers(1, false);
  }, [search]);

  // Infinite scroll: observe last row
  const lastRowRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchUsers(page + 1, true);
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page]);

  // Handlers
  const changeStatus = async (id, status) => {
    await api.put(`/api/admin/users/${id}/status`, { status });
    // update in-place
    setUsers(u => u.map(x => x.userId === id ? { ...x, subscriptionStatus: status } : x));
  };

  const toggleBlock = async (id, block) => {
    await api.put(`/api/admin/users/${id}/block`, { block });
    setUsers(u => u.map(x => x.userId === id ? { ...x, isBlocked: block } : x));
  };

  // Render
  return (
    
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        {/* Search & Mass Message */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border rounded px-3 py-2 w-1/3"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <MassMessageButton />
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left">
                {['Name','Email','City','Age','Status','Blocked','Joined','Actions'].map(col => (
                  <th key={col} className="px-4 py-2 border-b">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.userId}
                  ref={idx === users.length - 1 ? lastRowRef : null}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.city}</td>
                  <td className="px-4 py-2">{u.age}</td>
                  <td className="px-4 py-2">{u.subscriptionStatus}</td>
                  <td className="px-4 py-2">{u.isBlocked ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Status dropdown */}
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="px-2 py-1 bg-gray-100 rounded">⋮</Menu.Button>
                      
                        <Menu.Items className="absolute right-0 mt-1 bg-white border rounded shadow">
                          {['inactive','trialing','active','cancelled'].map(s => (
                            <Menu.Item key={s}>
                              <button
                                className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                onClick={() => changeStatus(u.userId, s)}
                              >
                                Set {s}
                              </button>
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                
                    </Menu>

                    {/* Block toggle */}
                    <button
                      onClick={() => toggleBlock(u.userId, !u.isBlocked)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>

                    {/* Personal message */}
                    <button
                      onClick={() => window.location = `/messages/${u.userId}`}
                      className="px-2 py-1 bg-teal-100 text-teal-600 rounded text-sm"
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="p-4 text-center">Loading…</p>}
        </div>
      </div>
    
  );
}

// Mass-message button + modal
function MassMessageButton() {
  const [open, setOpen]   = useState(false);
  const [filters, setFilters] = useState({
    gender: '', ageMin: '', ageMax: '', city: '', eventIds: '', labels: ''
  });
  const [text, setText]   = useState('');
  const sendBroadcast = async () => {
    await api.post('/api/admin/messages/broadcast', {
      filters: {
        ...filters,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        eventIds: filters.eventIds.split(',').map(s=>s.trim()).filter(Boolean),
        labels:   filters.labels.split(',').map(s=>s.trim()).filter(Boolean)
      },
      text
    });
    alert('Broadcast sent');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Mass Message
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2 space-y-4">
            <h2 className="text-xl font-semibold">Broadcast Message</h2>

            {/* Filters inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Gender</label>
                <input
                  value={filters.gender}
                  onChange={e=>setFilters(f=>({...f,gender:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>City</label>
                <input
                  value={filters.city}
                  onChange={e=>setFilters(f=>({...f,city:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>Age Min</label>
                <input
                  type="number"
                  value={filters.ageMin}
                  onChange={e=>setFilters(f=>({...f,ageMin:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>Age Max</label>
                <input
                  type="number"
                  value={filters.ageMax}
                  onChange={e=>setFilters(f=>({...f,ageMax:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="col-span-2">
                <label>Event IDs (comma-sep)</label>
                <input
                  value={filters.eventIds}
                  onChange={e=>setFilters(f=>({...f,eventIds:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="col-span-2">
                <label>Labels (comma-sep)</label>
                <input
                  value={filters.labels}
                  onChange={e=>setFilters(f=>({...f,labels:e.target.value}))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Message textarea */}
            <textarea
              rows="4"
              value={text}
              onChange={e=>setText(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Your message here…"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={sendBroadcast}
                className="px-4 py-2 bg-teal-600 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
