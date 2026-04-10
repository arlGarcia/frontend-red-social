import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { Save, User as UserIcon } from 'lucide-react';

export const Profile = () => {
  const { profile, loading, error, fetchMyProfile, updateProfile } = useProfileStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatarUrl: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const success = await updateProfile(formData.name, formData.bio, formData.avatarUrl);
    if (success) {
      setMessage('Perfil actualizado exitosamente.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading && !profile) return <div className="container" style={{textAlign: 'center', marginTop: '2rem'}}>Cargando perfil...</div>;

  return (
    <div className="container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div className="avatar" style={{ width: '4rem', height: '4rem', fontSize: '1.5rem' }}>
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" />
              ) : (
                <UserIcon size={32} />
              )}
            </div>
            <div>
              <h2>Configurar Perfil</h2>
              <p style={{ margin: 0 }}>{user?.email}</p>
            </div>
          </div>

          {error && <div className="alert">{error}</div>}
          {message && <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre visible</label>
              <input
                id="name"
                type="text"
                required
                minLength={3}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Biografía</label>
              <textarea
                id="bio"
                rows="4"
                maxLength={500}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="avatarUrl">URL de Avatar (opcional)</label>
              <input
                id="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
