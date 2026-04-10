import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { Save, User as UserIcon } from 'lucide-react';

export const Profile = () => {
  const { profile, loading, error, fetchMyProfile, updateProfile } = useProfileStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    birthDate: '',
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
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        alias: profile.alias || '',
        birthDate: profile.birthDate || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const success = await updateProfile(formData);
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
              <p style={{ margin: 0 }}>{user?.email} — <small>@{formData.alias}</small></p>
            </div>
          </div>

          {error && <div className="alert">{error}</div>}
          {message && <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="alias">Alias (Único)</label>
                <input
                  id="alias"
                  type="text"
                  required
                  value={formData.alias}
                  onChange={(e) => setFormData({...formData, alias: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="birthDate">Fecha de Nacimiento</label>
                <input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Biografía</label>
              <textarea
                id="bio"
                rows="3"
                maxLength={500}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="avatarUrl">URL de Avatar</label>
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
