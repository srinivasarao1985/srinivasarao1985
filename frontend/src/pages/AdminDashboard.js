import React, { useState, useEffect } from 'react';
import { adminService } from '../services';
import { toast } from 'react-toastify';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data.stats);

      const usersResponse = await adminService.getAllUsers();
      setUsers(usersResponse.data.users);

      const reportsResponse = await adminService.getReports();
      setReports(reportsResponse.data.reports);

      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard');
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminService.verifyUserProfile(userId);
      toast.success('User verified');
      loadDashboard();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'stats' ? '#e91e63' : '#ddd',
          }}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'users' ? '#e91e63' : '#ddd',
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'reports' ? '#e91e63' : '#ddd',
          }}
        >
          Reports
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Users</h3>
            <p style={styles.statNumber}>{stats.totalUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Verified Users</h3>
            <p style={styles.statNumber}>{stats.verifiedUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Premium Users</h3>
            <p style={styles.statNumber}>{stats.premiumUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Revenue</h3>
            <p style={styles.statNumber}>${stats.totalRevenue}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.table}>
          <h2>All Users</h2>
          <table style={styles.tableElement}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.isVerified ? '✓ Verified' : '✗ Unverified'}</td>
                  <td>
                    {!user.isVerified && (
                      <button
                        onClick={() => handleVerifyUser(user._id)}
                        style={styles.actionButton}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reports' && (
        <div style={styles.table}>
          <h2>Reports</h2>
          <table style={styles.tableElement}>
            <thead>
              <tr>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.reportedUser?.firstName}</td>
                  <td>{report.reason}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    color: '#e91e63',
    marginBottom: '30px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '32px',
    color: '#e91e63',
    margin: '10px 0 0 0',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
  },
  tableElement: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  actionButton: {
    padding: '5px 10px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
