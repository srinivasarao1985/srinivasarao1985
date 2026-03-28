import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export const Navbar = () => {
  const { token, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
          💑 Matrimonial
        </div>

        <div style={styles.menu}>
          {token && user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  ...styles.navLink,
                  borderBottom: isActive('/dashboard') ? '2px solid #e91e63' : 'none',
                }}
              >
                Discover
              </button>
              <button
                onClick={() => navigate('/messages')}
                style={{
                  ...styles.navLink,
                  borderBottom: isActive('/messages') ? '2px solid #e91e63' : 'none',
                }}
              >
                Messages
              </button>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  ...styles.navLink,
                  borderBottom: isActive('/profile') ? '2px solid #e91e63' : 'none',
                }}
              >
                Profile
              </button>
              <button
                onClick={() => navigate('/subscription')}
                style={{
                  ...styles.navLink,
                  borderBottom: isActive('/subscription') ? '2px solid #e91e63' : 'none',
                }}
              >
                Premium
              </button>

              <div style={styles.userSection}>
                <span style={styles.userName}>{user.firstName}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={styles.navLink}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={styles.signupBtn}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e91e63',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    cursor: 'pointer',
    padding: '8px 0',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderLeft: '1px solid #eee',
    paddingLeft: '20px',
  },
  userName: {
    color: '#333',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  signupBtn: {
    padding: '8px 16px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
