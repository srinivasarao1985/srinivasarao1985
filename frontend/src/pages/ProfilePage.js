import React, { useState, useEffect } from 'react';
import { profileService } from '../services';
import { useAuthStore } from '../context/authStore';
import { uploadToCloudinary } from '../utils/helpers';
import { toast } from 'react-toastify';

export const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    occupation: user?.occupation || '',
    education: user?.education || '',
    religion: user?.religion || '',
    caste: user?.caste || '',
    location: user?.location || { city: '', state: '' },
  });
  const [photos, setPhotos] = useState(user?.photos || []);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setProfileData({
        ...profileData,
        location: { ...profileData.location, [field]: value },
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (photos.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }

    setUploadingPhoto(true);
    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file));
      const uploadedPhotos = await Promise.all(uploadPromises);
      
      await profileService.uploadProfilePhotos(uploadedPhotos);
      
      setPhotos([...photos, ...uploadedPhotos.map(p => ({
        url: p.secure_url,
        publicId: p.public_id
      }))]);
      
      toast.success('Photos uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photos');
      console.error(error);
    } finally {
      setUploadingPhoto(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await profileService.deletePhoto(photoId);
      setPhotos(photos.filter((p) => p._id !== photoId));
      
      // If deleted photo was profile picture, clear it
      if (profilePicture?._id === photoId) {
        setProfilePicture(null);
      }
      
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleSetProfilePicture = async (photoId) => {
    try {
      await profileService.setProfilePicture(photoId);
      const photo = photos.find((p) => p._id === photoId);
      setProfilePicture(photo);
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to set profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Profile</h1>
        
        {/* Photo Upload Section */}
        <div style={styles.photoSection}>
          <h2 style={styles.sectionTitle}>Profile Photos</h2>
          
          <div style={styles.uploadBox}>
            <label style={styles.uploadLabel}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto || photos.length >= 10}
                style={{ display: 'none' }}
              />
              <span style={{
                ...styles.uploadButton,
                opacity: photos.length >= 10 ? 0.5 : 1,
                cursor: photos.length >= 10 ? 'not-allowed' : 'pointer'
              }}>
                {uploadingPhoto ? 'Uploading...' : `+ Add Photos (${photos.length}/10)`}
              </span>
            </label>
          </div>

          {/* Display Photos */}
          <div style={styles.photosGrid}>
            {photos.map((photo) => (
              <div key={photo._id} style={styles.photoCard}>
                <img src={photo.url} alt="Profile" style={styles.photoImage} />
                <div style={styles.photoActions}>
                  <button
                    onClick={() => handleSetProfilePicture(photo._id)}
                    style={{
                      ...styles.photoActionBtn,
                      backgroundColor: profilePicture?._id === photo._id ? '#4caf50' : '#2196f3',
                    }}
                  >
                    {profilePicture?._id === photo._id ? '✓ Profile' : 'Set Profile'}
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    style={styles.photoDeleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '100px' }}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Occupation</label>
            <input
              type="text"
              name="occupation"
              value={profileData.occupation}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Education</label>
            <input
              type="text"
              name="education"
              value={profileData.education}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Religion</label>
            <input
              type="text"
              name="religion"
              value={profileData.religion}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Caste</label>
            <input
              type="text"
              name="caste"
              value={profileData.caste}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>City</label>
            <input
              type="text"
              name="location.city"
              value={profileData.location.city}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#e91e63',
    marginBottom: '30px',
  },
  photoSection: {
    marginBottom: '40px',
    paddingBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
  },
  sectionTitle: {
    color: '#333',
    fontSize: '18px',
    marginBottom: '20px',
  },
  uploadBox: {
    marginBottom: '20px',
  },
  uploadLabel: {
    cursor: 'pointer',
  },
  uploadButton: {
    display: 'inline-block',
    padding: '12px 20px',
    backgroundColor: '#e91e63',
    color: 'white',
    borderRadius: '4px',
    border: '2px dashed #e91e63',
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  photoCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#f5f5f5',
  },
  photoImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  photoActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    gap: '5px',
    padding: '8px',
  },
  photoActionBtn: {
    flex: 1,
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  photoDeleteBtn: {
    flex: 1,
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};
