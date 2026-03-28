import React, { useState, useEffect } from 'react';
import apiService from '../services/index';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchStats();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRecommendations();
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getMatchStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAction = async (recommendationId, action) => {
    try {
      await apiService.updateRecommendationStatus(recommendationId, action);
      fetchRecommendations();
      fetchStats();
    } catch (error) {
      console.error(`Error ${action} recommendation:`, error);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div style={styles.container}>
      <h1>🎯 Smart Matches</h1>

      {/* Statistics */}
      {stats && (
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <h3>{stats.totalRecommendations}</h3>
            <p>Recommendations</p>
          </div>
          <div style={styles.statCard}>
            <h3>{stats.averageMatchScore}%</h3>
            <p>Avg Match Score</p>
          </div>
          <div style={styles.statCard}>
            <h3>{stats.liked}</h3>
            <p>Liked</p>
          </div>
          <div style={styles.statCard}>
            <h3>{stats.rejected}</h3>
            <p>Skipped</p>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div style={styles.recommendationsSection}>
        <h2>Your Top Matches</h2>
        {recommendations.map((rec) => (
          <div key={rec._id} style={styles.recommendationCard}>
            <div style={styles.profileInfo}>
              <img
                src={rec.recommendedUserId?.profilePicture?.url || 'https://via.placeholder.com/100'}
                alt={rec.recommendedUserId?.firstName}
                style={styles.profileImage}
              />
              <div style={styles.userDetails}>
                <h3>
                  {rec.recommendedUserId?.firstName} {rec.recommendedUserId?.lastName}
                </h3>
                <p>{rec.recommendedUserId?.occupation}</p>
                <p>📍 {rec.recommendedUserId?.location?.city}</p>
              </div>
            </div>

            <div style={styles.matchInfo}>
              <div style={styles.matchScore}>
                <div
                  style={{
                    ...styles.scoreCircle,
                    backgroundColor: getMatchColor(rec.matchScore),
                  }}
                >
                  <span style={styles.scoreText}>{rec.matchScore}%</span>
                </div>
                <p>Match</p>
              </div>
              <p style={styles.reason}>{rec.reason}</p>
            </div>

            <div style={styles.actionButtons}>
              <button
                onClick={() => handleAction(rec._id, 'like')}
                style={styles.likeButton}
              >
                ❤️ Like
              </button>
              <button
                onClick={() => handleAction(rec._id, 'reject')}
                style={styles.rejectButton}
              >
                ✕ Skip
              </button>
              <button style={styles.viewButton}>View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div style={styles.emptyState}>
          <p>No recommendations yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  recommendationsSection: {
    marginTop: '30px',
  },
  recommendationCard: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    gap: '20px',
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  userDetails: {
    flex: 1,
  },
  matchInfo: {
    textAlign: 'center',
    minWidth: '100px',
  },
  matchScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    color: 'white',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: '24px',
  },
  reason: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
  },
  likeButton: {
    backgroundColor: '#e55039',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  viewButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
};

export default RecommendationsPage;
