import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, ShieldCheck, MessageSquare, Send,
  Award, Heart, Calendar, Clock, Star, Hash
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  const token = localStorage.getItem('token');
  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('user')); } catch(e) {}

  useEffect(() => { fetchGroups(); fetchTherapists(); }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchPosts(selectedGroup._id);
      const interval = setInterval(() => fetchPosts(selectedGroup._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/community/groups', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) setSelectedGroup(data[0]);
    } catch (err) { console.error('Failed to fetch groups', err); }
  };

  const fetchTherapists = async () => {
    try {
      const res = await fetch('/api/community/therapists', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTherapists(data.filter(d => d.role === 'therapist' || d.__t === 'therapist'));
    } catch (err) { console.error('Failed to fetch therapists', err); }
  };

  const fetchPosts = async (groupId) => {
    try {
      const res = await fetch(`/api/community/groups/${groupId}/posts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPosts(data.reverse());
    } catch (err) { console.error('Failed to fetch posts', err); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedGroup) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/community/groups/${selectedGroup._id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newPost })
      });
      const post = await res.json();
      setPosts(prev => [...prev, post]);
      setNewPost('');
    } catch (err) { console.error('Failed to create post', err); }
    finally { setPosting(false); }
  };

  const chatContainerRef = useRef(null);
  const prevPostsLength = useRef(0);
  const scrollToBottom = () => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  useEffect(() => {
    if (posts.length !== prevPostsLength.current) {
      scrollToBottom();
      prevPostsLength.current = posts.length;
    }
  }, [posts]);

  const renderGroups = () => (
    <div className="flex flex-col md:flex-row h-[750px] bg-obsidian-800/60 backdrop-blur-sm rounded-3xl border border-obsidian-700 shadow-2xl shadow-black/30 overflow-hidden">
      {/* Sidebar */}
      <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-obsidian-700 bg-obsidian-900/40 flex flex-col">
        <div className="p-6 pb-3">
          <p className="text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-1">My Forums</p>
          <h2 className="text-white font-black text-lg">Support Groups</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {groups.map(group => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                selectedGroup?._id === group._id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-obsidian-800/50 border-obsidian-700 text-obsidian-300 hover:border-obsidian-500 hover:text-white'
              }`}
            >
              <h3 className="font-bold mb-1 line-clamp-1 text-sm">{group.name}</h3>
              <p className={`text-xs flex items-center gap-1 ${selectedGroup?._id === group._id ? 'text-cyan-400' : 'text-obsidian-500'}`}>
                <Hash size={11} /> {group.topic}
              </p>
            </button>
          ))}
          {groups.length === 0 && <p className="text-sm text-obsidian-500 text-center py-6">No groups found.</p>}
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 flex flex-col bg-transparent">
        {selectedGroup ? (
          <>
            {/* Group Header */}
            <div className="p-4 sm:p-6 border-b border-obsidian-700 flex items-center justify-between sticky top-0 bg-obsidian-900/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-cyan-400" />
                  {selectedGroup.name}
                </h3>
                <p className="text-xs text-obsidian-500 mt-0.5">Shared safe space for individuals facing similar challenges.</p>
              </div>
              {selectedGroup.adminId && (
                <div className="hidden sm:flex items-center gap-3 bg-obsidian-800 p-2 rounded-xl border border-obsidian-700">
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 text-cyan-400 rounded-full flex items-center justify-center font-black text-sm border border-cyan-500/30">
                    {selectedGroup.adminId.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1">
                      {selectedGroup.adminId.name} <ShieldCheck size={12} className="text-cyan-400" />
                    </p>
                    <p className="text-[10px] text-obsidian-500">Group Admin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Posts */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
              {posts.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center h-full opacity-40">
                  <MessageSquare size={40} className="text-obsidian-500 mb-3" />
                  <p className="text-obsidian-500 text-sm">No one has shared yet. Break the ice.</p>
                </div>
              )}
              {posts.map(post => {
                const isMine = post.authorId?._id === currentUser?.id;
                const isTherapist = post.authorId?.role === 'therapist' || post.authorId?.role === 'mentor';
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={post._id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${isTherapist ? 'text-cyan-400' : 'text-obsidian-400'}`}>
                        {isTherapist && <ShieldCheck size={10} />}
                        {isTherapist ? post.authorId.name : (isMine ? 'You' : 'Youth Member')}
                      </span>
                      <span className="text-[10px] text-obsidian-600">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isTherapist
                        ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20 rounded-tl-sm'
                        : isMine
                          ? 'bg-gradient-to-br from-cyan-500/30 to-teal-500/20 text-white border border-cyan-500/20 rounded-tr-sm'
                          : 'bg-obsidian-700/60 text-obsidian-200 border border-obsidian-600 rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Compose */}
            <div className="p-4 border-t border-obsidian-700 bg-obsidian-900/60">
              <form onSubmit={handlePost} className="flex items-end gap-2 bg-obsidian-800/80 p-2 rounded-2xl border border-obsidian-600 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share a thought or feeling anonymously..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm p-2 resize-none max-h-28 text-white placeholder-obsidian-500"
                  rows="2"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost(e); }}}
                />
                <button
                  type="submit"
                  disabled={!newPost.trim() || posting}
                  className="w-10 h-10 shrink-0 bg-gradient-to-br from-cyan-500 to-teal-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 mb-0.5 mr-0.5 shadow-lg shadow-cyan-500/30"
                >
                  <Send size={15} />
                </button>
              </form>
              <p className="text-[10px] text-obsidian-600 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={10} /> Moderated by verified professionals. Be kind.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Users size={56} className="text-obsidian-700 mb-4" />
            <h3 className="text-lg font-black text-obsidian-400 mb-2">Select a Group</h3>
            <p className="text-sm text-obsidian-600 max-w-sm mx-auto">Join a discussion anonymously with others who understand what you're going through.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTherapists = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {therapists.map(t => (
        <motion.div
          key={t._id}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-obsidian-800/60 backdrop-blur-sm rounded-3xl border border-obsidian-700 hover:border-cyan-500/40 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 p-6 flex flex-col group"
        >
          <div className="flex justify-between items-start mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl font-black border border-cyan-500/20 shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform">
              {t.name.charAt(0)}
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-amber-500/20">
              <Star size={11} fill="currentColor" /> {t.rating || 4.8}
            </div>
          </div>

          <h3 className="text-base font-black text-white flex items-center gap-1.5 mb-1">
            {t.name} <ShieldCheck size={14} className="text-cyan-400" />
          </h3>
          <p className="text-xs text-cyan-400 font-semibold mb-4">{t.clinicalSpecialization || t.specialization || 'Clinical Psychologist'}</p>

          <div className="space-y-2 mb-5 flex-1">
            {t.yearsExperience && (
              <p className="text-xs text-obsidian-400 flex items-center gap-2">
                <Clock size={11} className="text-obsidian-600" /> {t.yearsExperience} Experience
              </p>
            )}
            <p className="text-xs text-obsidian-400 flex items-center gap-2">
              <Award size={11} className="text-obsidian-600" /> License: {t.licenseNumber}
            </p>
            {t.sessionLanguages?.length > 0 && (
              <p className="text-xs text-obsidian-400 flex items-center gap-2">
                <Users size={11} className="text-obsidian-600" /> {t.sessionLanguages.join(', ')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {t.badges?.map((b, i) => (
              <span key={i} className="text-[10px] font-bold bg-obsidian-700 text-obsidian-300 px-2 py-1 rounded-lg border border-obsidian-600">
                {b}
              </span>
            ))}
            {t.crisisCertified && (
              <span className="text-[10px] font-bold bg-coral-500/10 text-coral-400 px-2 py-1 rounded-lg border border-coral-500/20 flex items-center gap-1">
                <Heart size={9} fill="currentColor" /> Crisis Certified
              </span>
            )}
          </div>

          <button
            onClick={() => { window.location.href = `/therapists/${t._id}`; }}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-black text-sm py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Request Session
          </button>
        </motion.div>
      ))}
      {therapists.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <UserCheck size={48} className="mx-auto mb-4 text-obsidian-700" />
          <p className="text-obsidian-500">Updating therapist directory. Please check back later.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Safe Space</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
                <Users size={20} className="text-cyan-400" />
              </span>
              Community Hub
            </h1>
            <p className="text-obsidian-400 mt-2 max-w-2xl text-sm sm:text-base">
              You are not alone. Connect with peers or reach out to verified professional therapists.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-obsidian-800/60 border border-obsidian-700 p-1.5 rounded-2xl flex mx-auto sm:mx-0 shrink-0">
            {['groups', 'therapists'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-white border border-cyan-500/30'
                    : 'text-obsidian-500 hover:text-obsidian-200'
                }`}
              >
                {tab === 'groups' ? 'Support Groups' : 'Therapists'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'groups' ? renderGroups() : renderTherapists()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
