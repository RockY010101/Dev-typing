import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [dbUser, setDbUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const navigate = useNavigate();

  const openDeleteModal = (id) => {
    setResultToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (resultToDelete) {
      axios.delete(`/api/results/${resultToDelete}`)
        .then(() => {
          setResults(prev => prev.filter(r => r._id !== resultToDelete));
          setShowDeleteModal(false);
          setResultToDelete(null);
        })
        .catch(err => console.error("Error deleting result", err));
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setResultToDelete(null);
  };

  const handleEditClick = () => {
    setEditName(dbUser.name || '');
    setEditUsername(dbUser.username || '');
    setEditPreview(dbUser.picture || '');
    setEditFile(null);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editName) formData.append('name', editName);
    if (editUsername) formData.append('username', editUsername);
    if (editFile) formData.append('picture', editFile);

    try {
      const res = await axios.put(`/api/users/${dbUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDbUser(res.data);
      localStorage.setItem('dbUser', JSON.stringify(res.data));
      window.dispatchEvent(new Event('userUpdated'));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile', err);
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dbUser');
      if (!savedUser || savedUser === 'undefined') {
        navigate('/register');
        return;
      }

      const user = JSON.parse(savedUser);
      if (!user || !user._id) {
        navigate('/register');
        return;
      }
      setDbUser(user);

      // Refresh user profile data
      axios.get(`/api/users/${user._id}`)
        .then(res => {
          setDbUser(res.data);
          localStorage.setItem('dbUser', JSON.stringify(res.data));
        })
        .catch(err => console.error("Error refreshing profile", err));

      axios.get(`/api/results/user/${user._id}`)
        .then(res => {
          setResults(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching results", err);
          setLoading(false);
        });
    } catch (e) {
      console.error("Error loading profile", e);
      localStorage.removeItem('dbUser');
      navigate('/register');
    }
  }, [navigate]);

  if (loading) {
    return <div className="page-container"><div className="text-white text-center py-12">Loading...</div></div>;
  }

  return (
    <div className="page-container" style={{ padding: '2rem', color: 'white' }}>

      {/* Top-left navigation */}
      <div style={{ position: 'fixed', top: '1.2rem', left: '1.2rem', display: 'flex', gap: '0.5rem', zIndex: 100 }}>
        <button
          onClick={() => navigate(-1)}
          title="Go Back"
          style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
        >
          &#8592;
        </button>
        <button
          onClick={() => navigate('/')}
          title="Go to Home"
          style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
        >
          🏠
        </button>
      </div>

      <div className="flex flex-col items-center">
        {dbUser && !isEditing && (
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '800px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative' }}>
            <img src={dbUser.picture} alt="profile" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #f97316' }} />
            <div>
              <h2 style={{ fontFamily: '"Press Start 2P", monospace', color: '#facc15', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{dbUser.username}</h2>
              <p style={{ color: '#9ca3af' }}>{dbUser.name ? `${dbUser.name} | ${dbUser.email}` : dbUser.email}</p>
            </div>
            <button onClick={handleEditClick} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Press Start 2P", monospace', fontSize: '0.7rem' }}>
              Edit Profile
            </button>
          </div>
        )}

        {dbUser && isEditing && (
          <form onSubmit={handleEditSubmit} style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '800px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontFamily: '"Press Start 2P", monospace', color: '#60a5fa', fontSize: '1.2rem', textAlign: 'center', marginBottom: '1rem' }}>Edit Profile</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={editPreview} alt="preview" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #f97316' }} />
              <label style={{ background: 'transparent', border: '1px solid #f97316', color: '#f97316', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Press Start 2P", monospace', fontSize: '0.7rem' }}>
                Choose File
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditFile(file);
                    setEditPreview(URL.createObjectURL(file));
                  }
                }} style={{ display: 'none' }} />
              </label>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem', marginLeft: '1rem' }}>
                {editFile ? editFile.name : "No file chosen"}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>Username</label>
              <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white' }} maxLength={15} required />
            </div>

            <div>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid #9ca3af', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f97316', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
            </div>
          </form>
        )}

        <div style={{ width: '100%', maxWidth: '800px' }}>
          <h3 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1.2rem', marginBottom: '1.5rem', color: '#60a5fa', textAlign: 'center' }}>Past Games</h3>
          {results.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>No games played yet. Go type!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'rgba(30, 20, 15, 0.8)', borderRadius: '12px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', borderBottom: '1px solid #f97316' }}>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>WPM</th>
                    <th style={{ padding: '1rem' }}>Accuracy</th>
                    <th style={{ padding: '1rem' }}>Time</th>
                    <th style={{ padding: '1rem' }}>Lang / Diff</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: '1rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', color: '#60a5fa', fontWeight: 'bold' }}>{r.wpm}</td>
                      <td style={{ padding: '1rem', color: '#facc15' }}>{r.accuracy}%</td>
                      <td style={{ padding: '1rem', color: '#34d399' }}>{r.timeTaken}s</td>
                      <td style={{ padding: '1rem' }}>{r.language} ({r.difficulty})</td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => openDeleteModal(r._id)}
                          style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                          title="Delete Result"
                          aria-label="Delete Result"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e140f', padding: '2rem', borderRadius: '12px', border: '1px solid #ef4444', color: 'white', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: '"Press Start 2P", monospace', fontSize: '1rem', color: '#ef4444' }}>Delete Result?</h3>
            <p style={{ marginBottom: '2rem', color: '#9ca3af' }}>Are you sure you want to delete this test result? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={cancelDelete} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #9ca3af', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
