import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pgService } from '../services';
import { PGCard, LoadingSpinner, EmptyState, Alert } from '../components/Common';
import { usePagination } from '../hooks';

export default function Browse() {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    gender: '',
    budget: '',
  });
  const { page, setPage, limit } = usePagination();

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        const response = await pgService.getAllPGs({
          page,
          limit,
          ...filters,
        });
        setPGs(response.data.pgs);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load PGs',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, [page, limit, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  if (loading && pgs.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-8">Browse PGs</h1>

      {/* Filters */}
      <div className="card mb-8">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="e.g., Delhi"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Gender Policy</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Family/Couple">Family/Couple</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="label">Max Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={filters.budget}
              onChange={handleFilterChange}
              placeholder="e.g., 5000"
              className="input-field"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ city: '', gender: '', budget: '' });
                setPage(1);
              }}
              className="btn-secondary w-full"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* PG Grid */}
      {pgs.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {pgs.map((pg) => (
            <Link key={pg._id} to={`/pg/${pg._id}`}>
              <PGCard pg={pg} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No PGs Found"
          description="Try adjusting your filters"
        />
      )}
    </div>
  );
}
