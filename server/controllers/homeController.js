import { insertRequest, getRequestByShareId } from '../models/requestModel.js';
import { insertResponse } from '../models/responseModel.js';
import {generateRandomNumber} from '../util/util.js';
import https from 'https';
import axios from 'axios';

export const postHome = (req, res) => {
    const { url } = req.body;

    let urlId;
    const parsedUrl = new URL(url);
    //console.log('Fetching URL:', parsedUrl);
    console.log('Domain:', parsedUrl.hostname);
    console.log('Scheme:', parsedUrl.protocol.replace(':', ''));
    console.log('Path:', parsedUrl.pathname);
    console.log('Method', req.method);
  
  
    const request = {
      shareId: generateRandomNumber(12), // Sample shareId
      url: url,
      method: req.method,
      pathUrl: parsedUrl.pathname,
      scheme: parsedUrl.protocol.replace(':', ''),
      domain: parsedUrl.hostname,
    };
  
  
    insertRequest(request, (error, results) => {
      if (error) {
        console.error('Error saving parsedUrl:', error);
      } else {
  
        urlId= results.insertId;
        console.log('Parsed URL saved successfully',results);
      
        
      }
    });
  
    // Structure to hold all responses
    let responses = [];
  
    // Recursive function to follow redirects
    const fetchUrl = (urlToFetch) => {
      // Parse the URL to log the domain, scheme, and path
  
      https.get(urlToFetch, (response) => {
        // Log and store the response
        const responseDetails = {
          request_id: urlId,
          version: `HTTP/${response.httpVersion}`,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          serverDate : response.headers['date'],
          serverName: response.headers['server'],
          location: response.headers.location || null,
        };
  
          // Insert each response into the database
          insertResponse(responseDetails, (error, results) => {
            if (error) {
              console.error('Error saving response:', error);
            } else {
              console.log('Response saved successfully',results);
            }
          });
  
  
        //print the each 
        console.log(responseDetails);
        responses.push(responseDetails);
  
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
  
        response.on('end', () => {
          // If there's a Location header, follow the redirect
          if (response.headers.location) {
           // fetchUrl(parsedUrl.hostname + response.headers.location); // Recursive call in case of location consist of the path
            fetchUrl(response.headers.location); // Recursive call
          } else {
  
  
            // No more redirects, send back the collected responses
            //console.log('Final Response Data:', rawData);
            res.status(200).json({shareId: request.shareId });
          }
        });
      }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
        res.status(500).send({ error: err.message });
      });
    };
  
    // Start the recursive fetching with the initial URL
    fetchUrl(url);
};

export const getSubmitPage = (req, res) => {
    const { shareId } = req.query;
    //const { shareId } = req.body;
    
  
    getRequestByShareId( shareId, (error, results) => {
      if (error) {
        console.error('Error fetching data from the database', error);
        res.status(500).send('Error fetching data from the database');
      } else {
        res.status(200).json(results); // Assuming you want to send the results from the database as a JSON response
      }
    });
  
};

export const postAnalyze = async(req, res) => {
    const urlToAnalyze = req.body.url;
    const apiKey =  "AIzaSyDDC_7jQs7Caz_c77YbWxX1k6sthpFbfJY"; // Replace with your API key if you have one
    //api_key =
    const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlToAnalyze)}&key=${apiKey}`;
    //const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlToAnalyze)}`;
  
    try {
      const response = await axios.get(apiEndpoint);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  
    //const response = await axios.get(apiEndpoint);
    //const res1= res1.json(response.data);
    //console.log(res1);
  
};