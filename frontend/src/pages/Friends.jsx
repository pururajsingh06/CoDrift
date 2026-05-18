import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, UserPlus, UserCheck, UserX, Check, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/useAuthStore';
import Avatar from '../components/ui/Avatar';
import { API_URL } from '../services/api';

const Friends = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('friends'); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data.friends || []);
      setPendingRequests(res.data.pendingRequests || []);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !token) return;
    
    try {
      const res = await axios.get(`${API_URL}/user/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      const friendIds = friends.map(f => f.id);
      const pendingIds = pendingRequests.map(r => r.user.id);
      const filtered = res.data.filter(u => !friendIds.includes(u.id) && !pendingIds.includes(u.id));
      
      setSearchResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const sendRequest = async (receiverId) => {
    if (!token) return;
    try {
      await axios.post(`${API_URL}/friends/request`, { receiverId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSearchResults(prev => prev.filter(u => u.id !== receiverId));
      alert('Friend request sent!');
    } catch (err) {
      console.error('Failed to send request:', err);
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  const acceptRequest = async (requestId) => {
    if (!token) return;
    try {
      await axios.put(`${API_URL}/friends/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriends();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const rejectRequest = async (requestId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_URL}/friends/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriends();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-8 flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Network</h1>
        </div>

        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {}
          <div className="flex border-b border-white/5">
            <button 
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'friends' ? 'text-green-400 border-b-2 border-green-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-5 h-5" />
              <span>My Friends ({friends.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'pending' ? 'text-green-400 border-b-2 border-green-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Pending Requests ({pendingRequests.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'search' ? 'text-green-400 border-b-2 border-green-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Search className="w-5 h-5" />
              <span>Find Users</span>
            </button>
          </div>

          <div className="p-6">
            {}
            {activeTab === 'friends' && (
              <div className="space-y-4">
                {friends.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    You haven't added any friends yet.
                  </div>
                ) : (
                  friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-xl hover:border-green-500/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar 
                          src={friend.avatar} 
                          name={friend.name} 
                          email={friend.email}
                          className="w-10 h-10" 
                          textClassName="text-lg" 
                          borderClassName="ring-1 ring-white/10"
                        />
                        <div>
                          <h3 className="font-bold text-white">{friend.name || 'Anonymous User'}</h3>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg" title="Message">
                        {/* Future messaging feature placeholder */}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No pending friend requests.
                  </div>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-xl hover:border-green-500/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar 
                          src={req.user.avatar} 
                          name={req.user.name} 
                          email={req.user.email}
                          className="w-10 h-10" 
                          textClassName="text-lg" 
                          borderClassName="ring-1 ring-white/10"
                        />
                        <div>
                          <h3 className="font-bold text-white">{req.user.name || 'Anonymous User'}</h3>
                          <p className="text-sm text-gray-500">Sent you a friend request</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => acceptRequest(req.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button 
                          onClick={() => rejectRequest(req.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-900/20"
                  >
                    Search
                  </button>
                </form>

                <div className="space-y-4">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      Search for someone to send them a friend request!
                    </div>
                  ) : (
                    searchResults.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-xl hover:border-green-500/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar 
                            src={user.avatar} 
                            name={user.name} 
                            email={user.email}
                            className="w-10 h-10" 
                            textClassName="text-lg" 
                            borderClassName="ring-1 ring-white/10"
                          />
                          <div>
                            <h3 className="font-bold text-white">{user.name || 'Anonymous User'}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => sendRequest(user.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-medium"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Add Friend</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
