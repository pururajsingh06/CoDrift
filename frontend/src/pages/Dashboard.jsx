import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Terminal, 
  Users, 
  Clock, 
  ExternalLink, 
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  Code2,
  Settings,
  LogOut,
  FolderOpen,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import ActionModal from '../components/ui/ActionModal';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/layout/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [view, setView] = useState('grid');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [actionModal, setActionModal] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const fetchRooms = async () => {
    if (!user || !token) return;
    try {
      const res = await axios.get('http://localhost:3000/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  const createNewSession = () => {
    setActionModal({
      type: 'createRoom',
      title: 'New Session',
      placeholder: 'Enter project name (e.g. My Awesome App)',
      initialValue: 'Untitled Session'
    });
  };

  const handleModalSubmit = async (value) => {
    const name = value?.trim() || 'Untitled Session';
    const roomId = Math.random().toString(36).substring(2, 8);
    try {
      if (token) {
        await axios.post('http://localhost:3000/rooms', { id: roomId, name }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate(`/session/${roomId}`);
    } catch (err) {
      console.error('Failed to create room', err);
      navigate(`/session/${roomId}`);
    }
    setActionModal(null);
  };

  const handleDeleteRoom = async (e, roomId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      if (token) {
        await axios.delete(`http://localhost:3000/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchRooms();
    } catch (err) {
      console.error('Failed to delete room', err);
    }
  };

  const handleJoinSession = () => {
    if (joinRoomId.trim()) {
      navigate(`/session/${joinRoomId.trim()}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Developer'}</h1>
            <p className="text-gray-400">Manage your collaborative coding sessions and projects.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden focus-within:border-green-500/50 transition-colors">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinSession()}
                className="bg-transparent px-4 py-3 outline-none text-sm w-32 sm:w-40 focus:w-48 transition-all"
              />
              <button
                onClick={handleJoinSession}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border-l border-white/10"
              >
                Join
              </button>
            </div>
            <button 
              onClick={createNewSession}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>New Session</span>
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Sessions', value: '12', icon: <Terminal className="text-blue-400" />, trend: '+2 this week' },
            { label: 'Collaborators', value: '48', icon: <Users className="text-purple-400" />, trend: '5 online now' },
            { label: 'Time Coded', value: '164h', icon: <Clock className="text-green-400" />, trend: 'Avg. 4h/day' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#161b22] border border-white/5 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#0d1117] rounded-lg border border-white/10">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-gray-400" />
              <span>Recent Sessions</span>
            </h2>
            
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="bg-[#0d1117] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm w-full focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                />
              </div>
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {rooms.map((session) => (
                  <motion.div 
                    key={session.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#0d1117] border border-white/5 p-5 rounded-xl hover:border-green-500/30 transition-all cursor-pointer group"
                    onClick={() => navigate(`/session/${session.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/20">
                          <Code2 className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">{session.name}</h3>
                          <p className="text-xs text-gray-500">ID: {session.id}</p>
                        </div>
                      </div>
                      <button onClick={(e) => handleDeleteRoom(e, session.id)} className="p-1 text-gray-600 hover:text-red-500 transition-colors" title="Delete Session">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-700 border border-[#0d1117]" />
                        </div>
                        <span className="text-xs text-gray-400">1 active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{new Date(session.updatedAt).toLocaleDateString()}</span>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
                {rooms.length === 0 && (
                  <div className="col-span-full py-10 text-center text-gray-500">
                    No sessions found. Create a new session to get started!
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between bg-[#0d1117] border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/session/${session.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <Code2 className="w-5 h-5 text-green-400" />
                      <div>
                        <h3 className="font-bold text-sm text-white">{session.name}</h3>
                        <p className="text-xs text-gray-500">Created on {new Date(session.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <span className="text-xs text-gray-400 hidden sm:block">ID: {session.id}</span>
                      <div className="flex items-center space-x-2 min-w-[80px]">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">1 member</span>
                      </div>
                      <button onClick={(e) => handleDeleteRoom(e, session.id)} className="text-gray-500 hover:text-red-500 transition-colors" title="Delete Session">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <div className="py-10 text-center text-gray-500">
                    No sessions found. Create a new session to get started!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {actionModal && (
        <ActionModal 
          title={actionModal.title}
          placeholder={actionModal.placeholder}
          initialValue={actionModal.initialValue}
          onSubmit={handleModalSubmit}
          onClose={() => setActionModal(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
