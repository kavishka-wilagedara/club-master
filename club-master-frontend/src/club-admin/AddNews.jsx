import React, { useContext, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';

export default function AddNews() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(UserContext);
  const clubId = user?.id?.split(':')[0];
  
  const [news, setNews] = useState({
    newsTitle: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const clubAdminId = user.id;
      const token = localStorage.getItem('authToken');
      
      // Map form fields to match backend expectations
      const newsData = {
        newsTitle: news.newsTitle,
        description: news.description,
        // The date will be set by the backend
      };
      
      const response = await axios.post(
        `${backendUrl}/news/${clubId}/save/${clubAdminId}`,
        newsData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('News created:', response.data);
      setSuccess(true);
      setNews({
        newsTitle: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error creating news:', err);
      setError(`Failed to create news: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <h2>Add News</h2>
      
      {success && <div className="alert alert-success">News added successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newsTitle">Title</label>
          <input
            type="text"
            className="form-control"
            id="newsTitle"
            name="newsTitle"
            value={news.newsTitle}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Content</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="5"
            value={news.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={news.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add News'}
        </button>
      </form>
    </div>
  );
}