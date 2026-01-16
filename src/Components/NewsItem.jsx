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

  // For aborting the HF fetch if component unmounts / user closes
  const fetchControllerRef = useRef(null);

  const api_key = process.env.REACT_APP_HUGGINGFACE_API_KEY;
  const placeholderImage =
    "https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg?w=768";

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
      // Abort ongoing fetch if any
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
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

  const handleCardClick = () => {
    handleCardTransition(() => {
      setShowOptions(true);
    });
  };

  const handleReadArticle = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleAISummary = async () => {
    // If we've already generated a summary, just open the summary view
    if (summary) {
      handleCardTransition(() => {
        setShowSummary(true);
      });
      return;
    }

    // Basic guard for missing API key
    if (!api_key) {
      setSummary("API key missing. Please set REACT_APP_HUGGINGFACE_API_KEY in your environment (recommended: proxy this server-side).");
      handleCardTransition(() => {
        setShowSummary(true);
      });
      return;
    }

    setLoading(true);
    handleCardTransition(() => {
      setShowSummary(true);
    });

    // Abort any previous controller
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    try {
      const textToSummarize = description || title;
      if (!textToSummarize) {
        setSummary("Not enough content to summarize.");
        setLoading(false);
        return;
      }

      const hfUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
      const payload = {
        inputs: textToSummarize,
        parameters: {
          max_length: 250,
          min_length: 60,
          do_sample: false
        }
      };

      const response = await fetch(hfUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api_key}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      // Handle non-OK status codes gracefully
      if (!response.ok) {
        // Try to extract error text
        let errText = `${response.status} ${response.statusText}`;
        try {
          const jsonErr = await response.json();
          if (jsonErr && jsonErr.error) errText += `: ${jsonErr.error}`;
        } catch (e) {
          const textErr = await response.text().catch(() => null);
          if (textErr) errText += `: ${textErr}`;
        }
        setSummary(`Unable to generate summary (API returned ${errText}).`);
        setLoading(false);
        return;
      }

      // Parse JSON if possible; otherwise fallback to text
      let result;
      try {
        result = await response.json();
      } catch (e) {
        const asText = await response.text().catch(() => null);
        result = asText;
      }

      // Hugging Face inference usually returns an array like [{ summary_text: "..." }]
      if (Array.isArray(result) && result.length > 0 && result[0].summary_text) {
        setSummary(result[0].summary_text);
      } else if (result && typeof result === "object" && result.summary_text) {
        setSummary(result.summary_text);
      } else if (typeof result === "string" && result.trim().length > 0) {
        setSummary(result);
      } else {
        console.warn("Unexpected response format from HF:", result);
        setSummary("Unable to generate summary at this time.");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // Request was aborted — do not treat as a failure the user needs to see
        console.log("HuggingFace request aborted.");
      } else {
        console.error("Error generating summary:", error);
        setSummary("Error generating summary. Please try again later.");
      }
    } finally {
      setLoading(false);
      // clear controller after completion
      fetchControllerRef.current = null;
    }
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
        <button
          type="button"
          className="btn p-0 text-start"
          onClick={handleCardClick}
          aria-label={`Open options for ${title}`}
          style={{ textDecoration: "none", color: "inherit", border: "none", background: "transparent" }}
        >
          <Card.Img
            variant="top"
            src={image || placeholderImage}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
          />
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
              {description ? description : "No description available."}
            </Card.Text>
          </Card.Body>
        </button>
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
                <Spinner animation="border" role="status" />
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
                type="button"
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
              type="button"
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
              type="button"
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
