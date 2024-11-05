import React from 'react';
import { Card } from 'react-bootstrap';

const NewsItem = ({ title, description, image, url }) => {
  const placeholderImage = "https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg?w=768"; // Placeholder URL

  return (
   <a href={url} target='_blank' style={{ textDecoration: 'none'}}>
   <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={image || placeholderImage} // Display placeholder if image is null
        alt={title} 
        onError={(e) => { e.target.src = placeholderImage; }} // Fallback if image fails to load
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>  {description ? description : "No description available."}</Card.Text>
      </Card.Body>
    </Card></a>
  );
};

export default NewsItem;
