import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Smartphone, Share2, MessageCircle, Heart,
  Bell, Camera, Play, Users, X
} from 'lucide-react';

const APPS = [
  { id: 1, name: 'Social Feed', subtitle: '2.1B users', color: '#1877f2', icon: <Share2 size={22} />, badge: 12 },
  { id: 2, name: 'Messaging', subtitle: '1.8B users', color: '#25d366', icon: <MessageCircle size={22} />, badge: 5 },
  { id: 3, name: 'Photo Share', subtitle: '1.4B users', color: '#e1306c', icon: <Camera size={22} />, badge: 3 },
  { id: 4, name: 'Video Stream', subtitle: '2.0B users', color: '#ff0000', icon: <Play size={22} />, badge: null },
  { id: 5, name: 'Micro Blog', subtitle: '450M users', color: '#1da1f2', icon: <Bell size={22} />, badge: 28 },
  { id: 6, name: 'Dating', subtitle: '75M users', color: '#fe3c72', icon: <Heart size={22} />, badge: 1 },
  { id: 7, name: 'Networking', subtitle: '900M users', color: '#0a66c2', icon: <Users size={22} />, badge: null },
  { id: 8, name: 'Mobile', subtitle: '3.5B devices', color: '#10b981', icon: <Smartphone size={22} />, badge: null },
];

const INITIAL_POSTS = [
  { user: 'alice_dev', content: 'Just deployed my first website! 🎉', likes: 248, time: '2h ago', replies: [{user: 'dev_guy', text: 'Congrats Alice! 🥳'}, {user: 'sarah_j', text: 'So proud of you!'}, {user: 'code_ninja', text: 'What stack did you use?'}] },
  { user: 'tech_guru', content: 'The future is mobile-first. #responsive', likes: 1024, time: '4h ago', replies: [{user: 'ux_designer', text: '100% agree'}, {user: 'mobile_dev', text: 'Preach!'}, {user: 'frontend_master', text: 'Mobile-first > desktop-first'}] },
  { user: 'web_pioneer', content: 'Remember when we used to go outside? 📱😂', likes: 512, time: '6h ago', replies: [{user: 'zoomer', text: 'Lol never heard of it'}, {user: 'gamer99', text: 'What is "outside"?'}] },
];

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
};

/* ── WOW: Expandable App Overlay (Wireframes) ── */
const AppOverlay = ({ app, onClose }) => {
  return (
    <motion.div
      className="app-overlay-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="app-overlay-window"
        initial={{ y: '20%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '20%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--app-color': app.color }}
      >
        <div className="app-window-header">
          <div className="app-window-title">
            <span style={{ color: app.color }}>{app.icon}</span> 
            <strong>{app.name}</strong> Interface
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="app-window-content">
          {app.id === 1 && (
             <div className="wf-search">
                <div className="wf-search-bar" />
                {[1,2,3,4].map(i => <div key={i} className="wf-search-result" />)}
             </div>
          )}
          {app.id === 2 && (
             <div className="wf-video">
                <div className="wf-video-player"><Video size={48} color="rgba(255,255,255,0.2)"/></div>
                <div className="wf-video-title" />
                <div className="wf-video-desc" />
             </div>
          )}
          {app.id === 3 && (
             <div className="wf-shop">
                {[1,2,3,4,5,6].map(i => <div key={i} className="wf-shop-item" />)}
             </div>
          )}
          {app.id === 4 && (
             <div className="wf-social">
                {[1,2,3].map(i => (
                  <div key={i} className="wf-social-feed-item">
                    <div className="wf-avatar"/>
                    <div className="wf-lines"><div className="wf-line"/><div className="wf-line half"/></div>
                  </div>
                ))}
             </div>
          )}
          {app.id === 5 && (
             <div className="wf-photo">
                <div className="wf-photo-hero" />
                <div className="wf-photo-grid">
                  {[1,2,3,4].map(i => <div key={i} className="wf-photo-thumb" />)}
                </div>
             </div>
          )}
          {app.id === 6 && (
             <div className="wf-dating">
                <div className="wf-dating-card">
                  <div className="wf-dating-photo"><Heart size={48} color="rgba(255,255,255,0.1)"/></div>
                  <div className="wf-dating-actions">
                     <div className="wf-btn nope">×</div>
                     <div className="wf-btn like">♥</div>
                  </div>
                </div>
             </div>
          )}
          {app.id === 7 && (
             <div className="wf-network">
                {[1,2,3,4].map(i => (
                  <div key={i} className="wf-network-contact">
                    <div className="wf-avatar squared"/>
                    <div className="wf-info"><div className="wf-line"/><div className="wf-line short"/></div>
                  </div>
                ))}
             </div>
          )}
          {app.id === 8 && (
             <div className="wf-mobile">
                <div className="wf-mobile-widgets">
                   <div className="wf-widget large" />
                   <div className="wf-widget small" />
                   <div className="wf-widget small" />
                </div>
             </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── WOW: Expandable Post Overlay ── */
const PostOverlay = ({ post, likedPosts, toggleLike, idx, onClose, onAddReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(idx, { user: 'You', text: replyText.trim() });
    setReplyText('');
  };

  return (
    <motion.div
      className="post-overlay-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="post-overlay-card"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overlay-close" onClick={onClose}><X size={18} /></div>
        <div className="overlay-header">
          <div className="post-avatar-lg">{post.user[0].toUpperCase()}</div>
          <div>
            <div className="overlay-username">@{post.user}</div>
            <div className="overlay-time">{post.time}</div>
          </div>
        </div>
        <div className="overlay-content">{post.content}</div>
        <div className="overlay-stats">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={() => toggleLike(idx)}
            className={`overlay-like ${likedPosts[idx] ? 'liked' : ''}`}
          >
            <Heart size={18} fill={likedPosts[idx] ? '#ef4444' : 'none'} />
            <span>{post.likes + (likedPosts[idx] ? 1 : 0)} Likes</span>
          </motion.button>
          <span>{post.replies.length} Replies</span>
        </div>
        <div className="overlay-replies">
          <div className="replies-title">Replies</div>
          <div className="replies-list" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '10px' }}>
            {post.replies.map((r, i) => {
              const isYou = r.user === 'You';
              const initial = isYou ? 'U' : r.user[0].toUpperCase();
              const bgColor = isYou ? '#e5e7eb' : stringToColor(r.user);
              const textColor = isYou ? '#666' : 'white';
              return (
                <div key={i} className="reply-item">
                  <div className="reply-avatar" style={{ background: bgColor, color: textColor }}>{initial}</div>
                  <span style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700, marginRight: '6px', color: '#111' }}>{r.user}</span>
                    {r.text}
                  </span>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleReply} className="reply-form">
            <div className="reply-avatar" style={{ background: '#3b82f6', color: 'white' }}>Y</div>
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="reply-input"
            />
            <button type="submit" disabled={!replyText.trim()} className="reply-submit">Send</button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Social = ({ active }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedPost, setExpandedPost] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    if (!active) return;
    gsap.fromTo('.app-card',
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }
    );
    gsap.fromTo('.social-post',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 0.5 }
    );
  }, [active]);

  const toggleLike = (i) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(i)) {
        newSet.delete(i);
      } else {
        newSet.add(i);
      }
      return newSet;
    });
  };
  
  const handleAddReply = (idx, replyObj) => {
    setPosts(prev => {
      const newPosts = [...prev];
      newPosts[idx] = {
        ...newPosts[idx],
        replies: [...newPosts[idx].replies, replyObj]
      };
      return newPosts;
    });
  };

  return (
    <section className="section social">
      <div className="social-bg-pattern" />

      <div className="social-layout">
        <div className="social-left">
          <div className="social-header">
            <h2>The Social & Mobile Era</h2>
            <p>2000s — 2010s · A world in your pocket</p>
          </div>
          <div className="app-grid">
            {APPS.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="app-card"
                onClick={() => setActiveApp(app)}
              >
                <div className="app-icon-wrap">
                  <div className="app-icon" style={{ background: app.color }}>{app.icon}</div>
                  {app.badge && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="app-badge">{app.badge}</motion.span>}
                </div>
                <span className="app-name">{app.name}</span>
                <span className="app-sub">{app.subtitle}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="social-right">
          <div className="phone-mockup">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="feed-header">For You</div>
              {posts.map((post, i) => (
                <div
                  key={i}
                  className="social-post"
                  onClick={() => setExpandedPost(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="post-avatar">{post.user[0].toUpperCase()}</div>
                  <div className="post-body">
                    <div className="post-user">@{post.user} · <span className="post-time">{post.time}</span></div>
                    <div className="post-content">{post.content}</div>
                    <div className="post-actions">
                      <motion.button
                        whileTap={{ scale: 1.3 }}
                        onClick={(e) => { e.stopPropagation(); toggleLike(i); }}
                        className={`like-btn ${likedPosts.has(i) ? 'liked' : ''}`}
                      >
                        <Heart size={14} fill={likedPosts.has(i) ? '#ef4444' : 'none'} />
                        <span>{post.likes + (likedPosts.has(i) ? 1 : 0)}</span>
                      </motion.button>
                      <button className="action-btn"><MessageCircle size={14} /><span>Reply</span></button>
                      <button className="action-btn"><Share2 size={14} /><span>Share</span></button>
                    </div>
                    <div className="post-expand-hint">Tap to expand →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WOW: Expandable Post Overlay */}
      <AnimatePresence>
        {expandedPost !== null && (
          <PostOverlay
            idx={expandedPost}
            post={posts[expandedPost]}
            likedPosts={likedPosts}
            toggleLike={toggleLike}
            onClose={() => setExpandedPost(null)}
            onAddReply={handleAddReply}
          />
        )}
        {activeApp !== null && (
          <AppOverlay
            app={activeApp}
            onClose={() => setActiveApp(null)}
          />
        )}
      </AnimatePresence>

      <style jsx="true">{`
        /* App Overlay General */
        .app-overlay-window {
          background: #ffffff;
          width: 90%;
          max-width: 500px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
        }
        .app-window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem;
          border-bottom: 1px solid #f0f0f0;
          background: #fdfdfd;
        }
        .app-window-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          color: #333;
        }
        .app-window-content {
          padding: 1.5rem;
          background: #fafafa;
          height: 400px;
          overflow-y: auto;
        }

        /* Generic Wireframe Elements */
        .wf-avatar { width: 40px; height: 40px; border-radius: 50%; background: #eee; }
        .wf-avatar.squared { border-radius: 8px; }
        .wf-line { height: 12px; background: #eee; border-radius: 6px; margin-bottom: 8px; width: 100%; }
        .wf-line.half { width: 60%; }
        .wf-line.short { width: 40%; }
        
        /* 1. Search */
        .wf-search-bar { height: 45px; background: #fff; border: 2px solid #eee; border-radius: 24px; margin-bottom: 2rem; }
        .wf-search-result { height: 60px; background: #fff; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        
        /* 2. Video */
        .wf-video-player { height: 200px; background: var(--app-color); border-radius: 12px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; opacity: 0.8; }
        .wf-video-title { height: 20px; background: #ddd; border-radius: 4px; width: 80%; margin-bottom: 0.5rem; }
        .wf-video-desc { height: 12px; background: #eee; border-radius: 4px; width: 50%; }

        /* 3. Shop */
        .wf-shop { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .wf-shop-item { height: 140px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; }

        /* 4. Social */
        .wf-social-feed-item { display: flex; gap: 1rem; background: #fff; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .wf-lines { flex: 1; margin-top: 5px; }

        /* 5. Photo */
        .wf-photo-hero { height: 180px; background: #eee; border-radius: 12px; margin-bottom: 1rem; }
        .wf-photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .wf-photo-thumb { height: 100px; background: #eee; border-radius: 8px; }

        /* 6. Dating */
        .wf-dating-card { height: 320px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; flex-direction: column; overflow: hidden; border: 1px solid #f0f0f0; }
        .wf-dating-photo { flex: 1; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
        .wf-dating-actions { height: 80px; display: flex; align-items: center; justify-content: space-evenly; background: #fff; }
        .wf-btn { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; }
        .wf-btn.nope { color: #fe3c72; border: 2px solid #fe3c72; }
        .wf-btn.like { color: #4CAF50; border: 2px solid #4CAF50; }

        /* 7. Network */
        .wf-network-contact { display: flex; gap: 1rem; padding: 1rem; background: #fff; border-bottom: 1px solid #f5f5f5; align-items: center; }
        .wf-info { flex: 1; }

        /* 8. Mobile */
        .wf-mobile-widgets { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .wf-widget { background: #fff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; }
        .wf-widget.large { grid-column: span 2; height: 150px; background: linear-gradient(135deg, #f5f7fa, #c3cfe2); }
        .wf-widget.small { height: 120px; }

        .social {

          background: #f5f5f7;
          color: #1a1a1a;
          padding: 3rem 2rem;
          overflow: hidden;
        }
        .social-bg-pattern {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 20% 80%, rgba(239,68,68,0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .social-layout { display: flex; gap: 3rem; max-width: 1100px; width: 100%; z-index: 2; align-items: flex-start; }
        .social-left { flex: 1; }
        .social-right { flex-shrink: 0; }
        .social-header { margin-bottom: 2rem; }
        .social-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 0.3rem; }
        .social-header p { font-size: 0.85rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .app-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .app-card {
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          padding: 0.8rem; border-radius: 1rem; background: rgba(255,255,255,0.8);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.04);
          cursor: pointer; text-align: center;
        }
        .app-icon-wrap { position: relative; }
        .app-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
        .app-badge {
          position: absolute; top: -4px; right: -6px; background: #ef4444; color: white;
          font-size: 0.55rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: 99px;
          display: flex; align-items: center; justify-content: center; border: 2px solid #f5f5f7;
        }
        .app-name { font-size: 0.7rem; font-weight: 600; }
        .app-sub { font-size: 0.55rem; color: #999; }

        .phone-mockup { width: 280px; background: #1a1a1a; border-radius: 2rem; padding: 0.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .phone-notch { width: 80px; height: 6px; background: #333; border-radius: 3px; margin: 8px auto 0; }
        .phone-screen { background: #fff; border-radius: 1.5rem; margin-top: 8px; overflow: hidden; padding-bottom: 1rem; }
        .feed-header { padding: 0.8rem 1rem; font-weight: 700; font-size: 1rem; border-bottom: 1px solid #eee; }
        .social-post { display: flex; gap: 0.6rem; padding: 0.8rem 1rem; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
        .social-post:hover { background: #f8f8ff; }
        .post-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white;
          font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .post-body { flex: 1; min-width: 0; }
        .post-user { font-size: 0.65rem; font-weight: 600; }
        .post-time { color: #999; font-weight: 400; }
        .post-content { font-size: 0.72rem; margin: 0.3rem 0; line-height: 1.4; }
        .post-actions { display: flex; gap: 0.8rem; }
        .post-expand-hint { font-size: 0.5rem; color: #bbb; margin-top: 3px; }
        .like-btn, .action-btn { display: flex; align-items: center; gap: 3px; font-size: 0.6rem; color: #888; background: none; border: none; cursor: pointer; padding: 0; }
        .like-btn.liked { color: #ef4444; }

        /* Post Overlay */
        .post-overlay-bg {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .post-overlay-card {
          background: white; border-radius: 1.2rem; padding: 1.5rem;
          max-width: 400px; width: 100%; position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .overlay-close {
          position: absolute; top: 12px; right: 12px; cursor: pointer;
          color: #999; padding: 4px;
        }
        .overlay-close:hover { color: #333; }
        .overlay-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
        .post-avatar-lg {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white;
          font-weight: 700; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
        }
        .overlay-username { font-weight: 700; font-size: 1rem; }
        .overlay-time { font-size: 0.75rem; color: #999; }
        .overlay-content { font-size: 1.1rem; line-height: 1.5; margin-bottom: 1rem; }
        .overlay-stats {
          display: flex; gap: 1.5rem; align-items: center;
          padding: 0.8rem 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;
          font-size: 0.8rem; color: #666;
        }
        .overlay-like { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-size: 0.8rem; color: #666; padding: 0; }
        .overlay-like.liked { color: #ef4444; }
        .overlay-replies { margin-top: 1rem; }
        .replies-title { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .reply-item { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.4rem 0; font-size: 0.8rem; border-bottom: 1px solid #f5f5f5; }
        .reply-avatar {
          width: 24px; height: 24px; border-radius: 50%; background: #e5e7eb;
          font-size: 0.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .reply-form { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px dashed #eee; }
        .reply-input { flex: 1; border: 1px solid #ddd; border-radius: 99px; padding: 0.4rem 0.8rem; font-size: 0.75rem; outline: none; }
        .reply-input:focus { border-color: #3b82f6; }
        .reply-submit { background: #3b82f6; color: white; border: none; border-radius: 99px; padding: 0.4rem 0.8rem; font-size: 0.7rem; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .reply-submit:disabled { opacity: 0.5; cursor: not-allowed; background: #9ca3af; }

        @media (max-width: 768px) {
          .social-layout { flex-direction: column; }
          .app-grid { grid-template-columns: repeat(4, 1fr); }
          .phone-mockup { width: 100%; max-width: 280px; align-self: center; }
          .post-overlay-card { max-width: 95%; }
        }
      `}</style>
    </section>
  );
};

export default Social;
