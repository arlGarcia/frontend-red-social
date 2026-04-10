import React, { useEffect, useState } from 'react';
import { usePostsStore } from '../store/postsStore';
import { useLikesWebSocket } from '../hooks/useLikesWebSocket';
import { Heart, MessageSquare, Send } from 'lucide-react';

export const Feed = () => {
  const { posts, loading, error, fetchPosts, createPost, toggleLike, hasMore, page } = usePostsStore();
  const [newPostContent, setNewPostContent] = useState('');
  
  // Activar websocket
  useLikesWebSocket();

  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const success = await createPost(newPostContent);
    if (success) {
      setNewPostContent('');
    }
  };

  const handleLoadMore = () => {
    fetchPosts(page + 1, true);
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Create Post Form */}
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="¿Qué estás pensando?"
              rows="3"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              style={{ resize: 'none', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!newPostContent.trim()}
              >
                <Send size={16} /> Publicar
              </button>
            </div>
          </form>
        </div>

        {/* Feed Error/Loading */}
        {error && <div className="alert">{error}</div>}
        
        {/* Posts List */}
        <div className="card-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="avatar">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="post-meta">
                  <h4>{post.authorName}</h4>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="post-content">
                {post.content}
              </div>
              
              <div className="post-actions">
                <button 
                  className={`btn-icon ${post.likedByMe ? 'active' : ''}`}
                  onClick={() => toggleLike(post.id)}
                  title={post.likedByMe ? 'Quitar like' : 'Dar like'}
                >
                  <Heart size={20} fill={post.likedByMe ? 'currentColor' : 'none'} />
                </button>
                <span className="like-count">
                  {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                </span>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && !loading && (
            <div className="glass-panel" style={{ textAlign: 'center', opacity: 0.7 }}>
              <p>No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>
            </div>
          )}
          
          {hasMore && posts.length > 0 && (
            <button 
              onClick={handleLoadMore} 
              className="btn btn-ghost" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
