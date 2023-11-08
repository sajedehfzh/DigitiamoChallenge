import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import './css/SubmitPage.css';



const SubmitPage = () => {
  const { shareId } = useParams();
  const [responseData, setResponseData] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/submitpage?shareId=${shareId}`);
        setResponseData(response.data);
        // Assuming the first item in the response data array has the URL to analyze
          fetchPerformanceData(response.data[0].url);
        
      } catch (error) {
        console.error('Error fetching data from the backend', error);
      }
    };

    fetchData();
  }, [shareId]);

  const fetchPerformanceData = async (urlToAnalyze) => {
    try {
      const response = await axios.post('http://localhost:8081/analyze', { url: urlToAnalyze });
      const chartData = processChartData(response.data.lighthouseResult.audits);
      setResults(chartData);
      console.log(results);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const processChartData = (audits) => {
    // Extract the relevant metrics from the audits object
    const metrics = [
      { metric: 'First Contentful Paint', value: audits['first-contentful-paint'].numericValue },
      { metric: 'Speed Index', value: audits['speed-index'].numericValue },
      { metric: 'Time to Interactive', value: audits['interactive'].numericValue },
      { metric: 'Network Round Trip Times', value: audits['network-rtt'].numericValue },
      //Network round trip times (RTT) have a large impact on performance.
      // If the RTT to an origin is high, it's an indication that servers closer to the user could improve performance.
      { metric: 'Largest Contentful Paint', value: audits['largest-contentful-paint'].numericValue },
      { metric: 'Server Response Time', value: audits['server-response-time'].numericValue},
    ];


   // return metrics

    // Normalize the values to a scale of 0-100 for the radar chart
    const maxValues = metrics.map(metric => metric.value);
    const maxValue = Math.max(...maxValues);

    return metrics.map(metric => ({
    ...metric,
    value: (metric.value / maxValue) * 100, // Normalize to 100
      //fullMark: 100,
    }
    )
    );
  };

  return (
    <div className="main-container">
       {responseData.length > 0 && (
      <h1>{responseData[responseData.length-1].statusCode}</h1>
      )}
       {responseData.length > 0 && (
      <>
        <div> 
          <div className='statusMessage'>
            <h2>{responseData[responseData.length - 1].statusMessage}</h2>
          </div>
          <div className='topic'>
            <button type="button" className="methodButton" readOnly>
              {responseData[0].method}
            </button>
            <input
              type="text"
              value={responseData[0].url}
              readOnly
              className="url-holder"
            />
          </div>
        </div>
      </>
    )}
<div className="total_table">
      <table className="table">
        <thead>
          <tr>
            <th className="table-header">URL INFO</th>
          </tr>
        </thead>
        <tbody>
          {responseData.length > 0 && (
            <tr className="table-content">
              <td>
                Domain: {responseData[0].domain}<br />
                Scheme: {responseData[0].scheme}<br />
                Path: {responseData[0].pathUrl}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {responseData.map((data, index) => (
        <table key={index} className="table">
          <thead>
            <tr>
              <th className="table-header">Response</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-content">
              <td>
                Version + Code: {data.version} {data.statusCode}<br />
                {data.location ? <>Location: {data.location}<br /></> : <>Date: {data.serverDate}<br /></>}
                Server: {data.serverName}
              </td>
            </tr>
          </tbody>
        </table>
      ))}
</div>
      <div className="share-container">
        <button type="button" className="button" readOnly>
          Share
        </button>
        <p>
          <a href={`http://localhost:3000/${shareId}`} className="share-link">http://localhost:3000/{shareId}</a>
        </p>
      </div>
      
      {results && (
        <ResponsiveContainer width="100%" height={300} className="radar-chart-container">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


export default SubmitPage;
