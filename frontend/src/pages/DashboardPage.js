import React, { useEffect, useState } from 'react';
import { profileService } from '../services';
import { toast } from 'react-toastify';

export const DashboardPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await profileService.searchProfiles();
      setProfiles(response.data.users);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profiles');
      setLoading(false);
    }
  };

  const handleLike = async (profileId) => {
    try {
      const response = await profileService.likeProfile(profileId);
      if (response.data.mutualLike) {
        toast.success("It's a match!");
      } else {
        toast.success('Profile liked');
      }
      fetchProfiles();
    } catch (error) {
      toast.error('Failed to like profile');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Discover Matches</h1>
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
};
