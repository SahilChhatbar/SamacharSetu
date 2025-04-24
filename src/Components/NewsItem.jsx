import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Spinner } from "react-bootstrap";

const NewsItem = ({ title, description, image, url }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardRef = useRef(null);
  const typingIntervalRef = useRef(null);
  
  const placeholderImage =
    "https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg?w=768"; // Placeholder URL

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && showOptions) {
        handleCardTransition(() => {
          setShowOptions(false);
          setShowSummary(false);
        });
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [showOptions]);

  useEffect(() => {
    if (summary && showSummary && !loading) {
      setDisplayedSummary("");
      let i = 0;
      
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      typingIntervalRef.current = setInterval(() => {
        if (i < summary.length) {
          setDisplayedSummary(prev => prev + summary.charAt(i));
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, 20); 
    }
    
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [summary, showSummary, loading]);

  const handleCardTransition = (callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    handleCardTransition(() => {
      setShowOptions(true);
    });
  };

  const handleReadArticle = () => {
    window.open(url, "_blank");
  };

  const handleAISummary = async () => {
    if (summary) {
      handleCardTransition(() => {
        setShowSummary(true);
      });
      return;
    }

    setLoading(true);
    handleCardTransition(() => {
      setShowSummary(true);
    });
    
    try {
      const textToSummarize = description || title;
      if (!textToSummarize) {
        setSummary("Not enough content to summarize.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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"
          },
          body: JSON.stringify({
            inputs: textToSummarize,
            parameters: {
              max_length: 250,
              min_length: 100,
              do_sample: false
            }
          }),
        }
      );

      const result = await response.json();
      if (result.error) {
        console.error("API Error:", result.error);
        setSummary(`Unable to generate summary: ${result.error}`);
        setLoading(false);
        return;
      }
      if (result && result[0] && result[0].summary_text) {
        setSummary(result[0].summary_text);
      } else {
        console.log("Unexpected response format:", result);
        setSummary("Unable to generate summary at this time.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Error generating summary. Please try again later.");
    }
    
    setLoading(false);
  };
  
  const handleBack = () => {
    if (showSummary) {
      handleCardTransition(() => {
        setShowSummary(false);
      });
    } else {
      handleCardTransition(() => {
        setShowOptions(false);
      });
    }
  };

  const getSummaryContentHeight = () => {
    return "250px"; 
  };

  const cardClasses = `h-100 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`;
  const transitionStyle = {
    transition: 'all 0.3s ease',
    transform: isTransitioning ? 'scale(0.98)' : 'scale(1)'
  };

  return (
    <Card className={cardClasses} ref={cardRef} style={transitionStyle}>
      {!showOptions ? (
        <a 
          href="#" 
          onClick={handleCardClick} 
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card.Img
            variant="top"
            src={image || placeholderImage}
            alt={title}
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
              {description ? description : "No description available."}
            </Card.Text>
          </Card.Body>
        </a>
      ) : showSummary ? (
        <Card.Body className="d-flex flex-column p-0">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <Button 
              variant="outline-secondary"
              size="sm"
              className="px-2 py-0" 
              onClick={handleBack}
            >
              ← 
            </Button>
            <Card.Title className="mb-0 p-2">AI Summary</Card.Title>
            <div style={{ width: "45px" }}></div>
          </div>
          <div 
            className="flex-grow-1 overflow-auto px-3 py-2" 
            style={{ 
              maxHeight: getSummaryContentHeight(),
              overflowY: "auto" 
            }}
          >
            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Generating comprehensive summary...</p>
              </div>
            ) : (
              <Card.Text>
                {displayedSummary}
                {displayedSummary.length !== summary.length && (
                  <span className="border-dark typing-cursor-bootstrap"></span>
                )}
              </Card.Text>
            )}
          </div>
          <div className="p-3 border-top mt-auto">
            <div className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                onClick={handleReadArticle}
              >
                Read Full Article
              </Button>
            </div>
          </div>
        </Card.Body>
      ) : (
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button 
              variant="outline-secondary"
              size="sm"
              className="px-2 py-0" 
              onClick={handleBack}
            >
              ← 
            </Button>
            <Card.Title className="mb-0 p-2">{title}</Card.Title>
            <div style={{ width: "45px" }}></div>
          </div>
          <div className="d-flex flex-column mt-3">
            <Button
              variant="primary"
              className="mb-2"
              onClick={handleAISummary}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span className="ms-2">Loading...</span>
                </>
              ) : (
                "AI Summary"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleReadArticle}
            >
              Read Article
            </Button>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default NewsItem;