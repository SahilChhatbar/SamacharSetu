import './App.css';
import Header from './Components/Header';
import NewsBoard from './Components/NewsBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';

function App() {
  const [articles, setArticles] = useState([]);
  const API_KEY = 'HTV7_vvELnQGDTS-Dl6QP0jVZY_K7Vjcqf4PHk22SXKdenza'; // Replace with your actual API key
  const BASE_URL = 'https://api.currentsapi.services/v1/latest-news';

  const fetchArticles = async (category = '') => {
    const url = `${BASE_URL}?country=in${category ? `&category=${category}` : ''}&apiKey=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.news || []); // Set articles to the fetched data
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles(); // Fetch default articles on initial load
  }, []);

  const handleCategoryChange = (category) => {
    fetchArticles(category); // Fetch articles for the selected category
  };

  return (
    <div>
      <Header onCategoryChange={handleCategoryChange} />
      <div className="background-overlay"></div>
      <div className="content">
        <NewsBoard articles={articles} />
      </div>
    </div>
  );
}

export default App;
