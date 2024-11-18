import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, CardActions, Button, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import "./SearchPage.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState({});
  const [summarizedData, setSummarizedData] = useState([]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=10`
      );

      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, "application/xml");
      const entries = xml.getElementsByTagName("entry");

      const paperList = Array.from(entries).map((entry) => ({
        title: entry.getElementsByTagName("title")[0].textContent,
        summary: entry.getElementsByTagName("summary")[0].textContent,
        published: entry.getElementsByTagName("published")[0].textContent,
        link: entry.getElementsByTagName("id")[0].textContent,
        authors: entry.getElementsByTagName("author")[0]?.getElementsByTagName("name")[0]?.textContent || "Unknown",
        summarized: null,
      }));

      setPapers(paperList);
    } catch (error) {
      console.error("Error fetching research papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (index) => {
    const paper = papers[index];
    if (!paper) return;
  
    const pdfUrl = paper.link.replace("abs", "pdf") + ".pdf"; // Convert to PDF link
    setSummarizing((prev) => ({ ...prev, [index]: true }));
  
    try {
      const response = await axios.post(" http://localhost:5001/api/summarize", {
        pdf_url: pdfUrl,
        authors: paper.authors,
        date: paper.published,
      });
  
      const updatedPapers = [...papers];
      updatedPapers[index].summarized = response.data;
  
      setPapers(updatedPapers);
  
      setSummarizedData((prev) => [
        ...prev,
        {
          Methodology: response.data.Methodology,
          Findings: response.data.Findings,
          Authors: response.data.Authors,
          Date: response.data.Date,
        },
      ]);
    } catch (error) {
      console.error("Error summarizing research paper:", error);
    } finally {
      setSummarizing((prev) => ({ ...prev, [index]: false }));
    }
  };
  

  const downloadCSV = () => {
    const csvContent = [
      ["Methodology", "Findings", "Authors", "Date"],
      ...summarizedData.map((row) => [row.Methodology, row.Findings, row.Authors, row.Date]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "summarized_papers.csv");
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      fetchPapers();
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Papers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "100%",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search
        </Button>
      </div>

      {loading && <CircularProgress style={{ margin: "20px auto" }} />}

      <div className="papers-container">
        {papers.map((paper, index) => (
          <Card className="paper-card" key={index}>
            <CardContent>
              <Typography variant="h6" className="paper-title">
                {paper.title}
              </Typography>
              <Typography variant="body2" className="paper-date">
                {new Date(paper.published).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="paper-summary">
                {paper.summary.substring(0, 200)}...
              </Typography>

              {paper.summarized && (
                <>
                  <Typography variant="body2" className="paper-summary">
                    <strong>Methodology:</strong> {paper.summarized.Methodology}
                  </Typography>
                  <Typography variant="body2" className="paper-summary">
                    <strong>Findings:</strong> {paper.summarized.Findings}
                  </Typography>
                  <Typography variant="body2" className="paper-summary">
                    <strong>Authors:</strong> {paper.summarized.Authors}
                  </Typography>
                  <Typography variant="body2" className="paper-summary">
                    <strong>Date:</strong> {paper.summarized.Date}
                  </Typography>
                </>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => handleSummarize(index)}
                disabled={summarizing[index]}
              >
                {summarizing[index] ? "Summarizing..." : "Summarize"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {summarizedData.length > 0 && (
        <Button variant="contained" color="success" onClick={downloadCSV} style={{ marginTop: "20px" }}>
          Download Table as CSV
        </Button>
      )}
    </div>
  );
}

export default SearchPage;
