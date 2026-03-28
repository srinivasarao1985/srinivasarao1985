import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

export const DashboardPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // Get all users except current user
      const response = await apiClient.get('/profiles');
      
      if (response.data && response.data.data) {
        setProfiles(response.data.data);
      } else if (Array.isArray(response.data)) {
        setProfiles(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setProfiles([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleLike = async (profileId) => {
    try {
      const response = await apiClient.post(`/profiles/${profileId}/like`);
      if (response.data.mutualLike) {
        toast.success("It's a match!");
      } else {
        toast.success('Profile liked');
      }
      fetchProfiles();
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Failed to like profile');
    }
  };

  if (loading) return <div style={styles.loading}>Loading profiles...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Discover Matches</h1>
      {profiles.length === 0 ? (
        <div style={styles.emptyState}>No profiles available</div>
      ) : (
        <div style={styles.profilesGrid}>
          {profiles.map((profile) => (
            <div key={profile._id} style={styles.profileCard}>
              <img
                src={profile.profilePicture?.url || 'https://via.placeholder.com/300'}
                alt={profile.firstName}
                style={styles.image}
              />
              <div style={styles.profileInfo}>
                <h2>{profile.firstName} {profile.lastName}</h2>
                <p>{profile.occupation}</p>
                <p>{profile.location?.city}</p>
                <button
                  onClick={() => handleLike(profile._id)}
                  style={styles.button}
                >
                  ❤️ Like
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#e91e63',
    marginBottom: '30px',
  },
  profilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
  profileInfo: {
    padding: '15px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#999',
  },
};

export default DashboardPage;
