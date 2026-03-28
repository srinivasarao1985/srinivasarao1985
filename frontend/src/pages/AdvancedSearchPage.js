import React, { useState, useEffect } from 'react';
import apiService from '../services/index';

const AdvancedSearchPage = () => {
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 50,
    religion: [],
    caste: [],
    location: [],
    occupation: [],
    gender: '',
  });

  const [results, setResults] = useState([]);
  const [filtered_Options, setFilteredOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await apiService.getFilterOptions();
        setFilteredOptions(response.data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: Array.isArray(value)
        ? prev[filterName].includes(value)
          ? prev[filterName].filter((item) => item !== value)
          : [...prev[filterName], value]
        : value,
    }));
  };

  // Perform search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await apiService.advancedSearch(filters);
      setResults(response.data);
      setPage(1);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Advanced Search</h2>

      <div style={styles.filtersSection}>
        <h3>Filters</h3>

        {/* Age Range */}
        <div style={styles.filterGroup}>
          <label>Age Range</label>
          <div style={styles.rangeInput}>
            <input
              type="number"
              min="18"
              max="70"
              value={filters.ageMin}
              onChange={(e) => handleFilterChange('ageMin', parseInt(e.target.value))}
              placeholder="Min age"
            />
            <span>-</span>
            <input
              type="number"
              min="18"
              max="70"
              value={filters.ageMax}
              onChange={(e) => handleFilterChange('ageMax', parseInt(e.target.value))}
              placeholder="Max age"
            />
          </div>
        </div>

        {/* Gender */}
        <div style={styles.filterGroup}>
          <label>Looking For</label>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Religion */}
        <div style={styles.filterGroup}>
          <label>Religion</label>
          <div style={styles.checkboxGroup}>
            {filtered_Options.religions?.map((religion) => (
              <label key={religion} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.religion.includes(religion)}
                  onChange={() => handleFilterChange('religion', religion)}
                />
                {religion}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div style={styles.filterGroup}>
          <label>Location</label>
          <div style={styles.checkboxGroup}>
            {filtered_Options.locations?.map((location) => (
              <label key={location} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={() => handleFilterChange('location', location)}
                />
                {location}
              </label>
            ))}
          </div>
        </div>

        {/* Occupation */}
        <div style={styles.filterGroup}>
          <label>Occupation</label>
          <div style={styles.checkboxGroup}>
            {filtered_Options.occupations?.map((occupation) => (
              <label key={occupation} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.occupation.includes(occupation)}
                  onChange={() => handleFilterChange('occupation', occupation)}
                />
                {occupation}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          style={styles.searchButton}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      <div style={styles.resultsSection}>
        <h3>Results ({results.length} profiles found)</h3>
        <div style={styles.profilesGrid}>
          {results.map((profile) => (
            <div key={profile._id} style={styles.profileCard}>
              <img
                src={profile.profilePicture?.url || 'https://via.placeholder.com/200'}
                alt={profile.firstName}
                style={styles.profileImage}
              />
              <h4>{profile.firstName} {profile.lastName}</h4>
              <p>{profile.occupation}</p>
              <p>{profile.location?.city}, {profile.location?.state}</p>
              <button style={styles.viewButton}>View Profile</button>
            </div>
          ))}
        </div>
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
  filtersSection: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  filterGroup: {
    marginBottom: '15px',
  },
  rangeInput: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchButton: {
    backgroundColor: '#e55039',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  resultsSection: {
    marginTop: '30px',
  },
  profilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  profileCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  profileImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  viewButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default AdvancedSearchPage;
