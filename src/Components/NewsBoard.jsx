import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NewsItem from './NewsItem';

const NewsBoard = ({ articles }) => (
  <Row className="g-4"> {/* This adds vertical spacing between rows */}
    {articles.map((article, index) => (
      <Col key={index} xs={12} sm={6} md={4} lg={3}> {/* 4 items in a row on large screens */}
        <NewsItem
          title={article.title}
          description={article.description}
          image={article.image} // Use 'image' field from the article\
          url={article.url} // Pass the article URL 
        />
      </Col>
    ))}
  </Row>
);

export default NewsBoard;
