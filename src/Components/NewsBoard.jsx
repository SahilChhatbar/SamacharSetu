import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NewsItem from './NewsItem';

const NewsBoard = ({ articles }) => (
  <Row className="g-4">
    {articles.map((article, index) => (
      <Col key={index} xs={12} sm={6} md={4} lg={3}>
        <NewsItem
          title={article.title}
          description={article.description}
          image={article.image} 
          url={article.url}  
        />
      </Col>
    ))}
  </Row>
);

export default NewsBoard;
