import React, { useState, useEffect } from 'react';
import apiService from '../services/index';

const ProfileVerificationPage = () => {
  const [verification, setVerification] = useState(null);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    setLoading(true);
    try {
      const response = await apiService.getVerificationStatus();
      setVerification(response.data);
      setTrustScore(response.data.trustScore);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrustBadge = (score) => {
    if (score >= 80) return { label: 'Highly Trusted', color: '#27ae60', icon: '⭐⭐⭐' };
    if (score >= 60) return { label: 'Trusted', color: '#f39c12', icon: '⭐⭐' };
    if (score >= 40) return { label: 'Verified', color: '#3498db', icon: '⭐' };
    return { label: 'Unverified', color: '#95a5a6', icon: '☆' };
  };

  const badge = getTrustBadge(trustScore);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>✅ Profile Verification</h1>

      {/* Trust Score Display */}
      <div style={styles.trustScoreSection}>
        <div
          style={{
            ...styles.trustScoreCircle,
            backgroundColor: badge.color,
          }}
        >
          <div style={styles.scoreNumber}>{trustScore}%</div>
          <div style={styles.scoreBadge}>{badge.icon}</div>
        </div>
        <div style={styles.trustLabel}>
          <h2>{badge.label}</h2>
          <p>Your profile trust score</p>
        </div>
      </div>

      {/* Verification Checks */}
      <div style={styles.verificationsSection}>
        <h3>Verification Status</h3>

        <div style={styles.verificationList}>
          <VerificationItem
            title="Identity Verification"
            description="Verify your government-issued ID"
            verified={verification?.identityVerified}
            points={35}
          />
          <VerificationItem
            title="Photo Verification"
            description="Upload a recent photo for verification"
            verified={verification?.photoVerified}
            points={35}
          />
          <VerificationItem
            title="Document Verification"
            description="Submit supporting documents"
            verified={verification?.documentVerified}
            points={30}
          />
        </div>
      </div>

      {/* Verification Badges */}
      {verification?.verificationBadges && verification.verificationBadges.length > 0 && (
        <div style={styles.badgesSection}>
          <h3>Your Badges</h3>
          <div style={styles.badgesList}>
            {verification.verificationBadges.map((badge, index) => (
              <div key={index} style={styles.badge}>
                ✓ {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Benefits */}
      <div style={styles.benefitsSection}>
        <h3>Benefits of Verification</h3>
        <ul style={styles.benefitsList}>
          <li>✅ Higher visibility in search results</li>
          <li>✅ Trusted badge on your profile</li>
          <li>✅ More profile views and likes</li>
          <li>✅ Better matching results</li>
          <li>✅ Safe and secure connections</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionSection}>
        <button style={styles.primaryButton}>
          Start Verification Process
        </button>
        <button style={styles.secondaryButton}>
          Upload Documents
        </button>
      </div>
    </div>
  );
};

const VerificationItem = ({ title, description, verified, points }) => (
  <div style={styles.verificationItem}>
    <div style={styles.verificationCheckmark}>
      {verified ? (
        <span style={styles.checkmark}>✓</span>
      ) : (
        <span style={styles.pending}>○</span>
      )}
    </div>
    <div style={styles.verificationContent}>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
    <div style={styles.verificationPoints}>
      +{points} pts
    </div>
  </div>
);

const styles = {
  container: {
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
  },
  trustScoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '30px',
  },
  trustScoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexShrink: 0,
  },
  scoreNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
  },
  scoreBadge: {
    fontSize: '24px',
  },
  trustLabel: {
    flex: 1,
  },
  verificationsSection: {
    marginBottom: '30px',
  },
  verificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  verificationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    gap: '15px',
  },
  verificationCheckmark: {
    fontSize: '24px',
    width: '40px',
    textAlign: 'center',
  },
  checkmark: {
    color: '#27ae60',
  },
  pending: {
    color: '#95a5a6',
  },
  verificationContent: {
    flex: 1,
  },
  verificationPoints: {
    backgroundColor: '#e55039',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  badgesSection: {
    marginBottom: '30px',
  },
  badgesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  badge: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  benefitsSection: {
    backgroundColor: '#e8f8f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
  },
  actionSection: {
    display: 'flex',
    gap: '10px',
  },
  primaryButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#e55039',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ProfileVerificationPage;
