import React, { useState, useEffect } from 'react';
import apiService from '../services/index';

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSuccessStories();
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    try {
      await apiService.likeSuccessStory(storyId);
      fetchSuccessStories();
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>Success Stories</h1>
      <p style={styles.subtitle}>Read inspiring love stories from our community</p>

      <div style={styles.storiesGrid}>
        {stories.map((story) => (
          <div key={story._id} style={styles.storyCard}>
            <div style={styles.photoSection}>
              {story.photos && story.photos[0] && (
                <img
                  src={story.photos[0].url}
                  alt="Couple"
                  style={styles.couplePhoto}
                />
              )}
            </div>

            <div style={styles.storyContent}>
              <h3>{story.title}</h3>
              <p className="couple-names">
                {story.user1Id?.firstName} & {story.user2Id?.firstName}
              </p>

              <p style={styles.story}>{story.story.substring(0, 150)}...</p>

              <div style={styles.metadata}>
                <span>❤️ {story.likes} likes</span>
                {story.weddingDate && (
                  <span>💒 {new Date(story.weddingDate).toLocaleDateString()}</span>
                )}
              </div>

              <div style={styles.actionButtons}>
                <button
                  onClick={() => handleLike(story._id)}
                  style={styles.likeButton}
                >
                  ❤️ Like
                </button>
                <button style={styles.readButton}>Read Full Story</button>
              </div>
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
  storiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  storyCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  photoSection: {
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  couplePhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  storyContent: {
    padding: '15px',
  },
  story: {
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  metadata: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#999',
    marginBottom: '12px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
  },
  likeButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#e55039',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  readButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
  },
};

export default SuccessStoriesPage;
