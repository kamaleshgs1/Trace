import React, { useState } from 'react';
import axios from 'axios';
import Graph from './Graph';

const InputPage = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [responseData, setResponseData] = useState('');
  const [infoResponse, setInfoResponse] = useState('');
  const [listResponse, setListResponse] = useState('');
  const [message, setMessage] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [sampleTraceData, setSampleTraceData] = useState(null); // Define setSampleTraceData

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const jsonData = JSON.parse(text);
      const response = await axios.post('http://localhost:3000/createBatch', jsonData);
      setResponseData(response.data.message);
      setMessage('Batch created successfully.');
      onSubmit(text);
    } catch (error) {
      console.error('Invalid JSON data:', error);
      setResponseData('Batch creation failed.');
      setMessage('Batch creation failed.');
    }
  };

  const handleGetInformation = async (key) => {
    try {
      const response = await axios.get(`http://localhost:3000/getDetailsByID/${key}`);
      const formattedInfoResponse = JSON.stringify(response.data, null, 2);
      setInfoResponse(formattedInfoResponse);
      setMessage('Information provided.');
    } catch (error) {
      console.error('Error fetching information:', error);
      setInfoResponse('Error fetching information.');
      setMessage('Error fetching information.');
    }
  };

  const handleListAll = async () => {
    try {
      const response = await axios.get('http://localhost:3000/listAll');
      const formattedListResponse = JSON.stringify(response.data, null, 2);
      setListResponse(formattedListResponse);
      setMessage('List fetched successfully.');
    } catch (error) {
      console.error('Error fetching list:', error);
      setListResponse('Error fetching list.');
      setMessage('Error fetching list.');
    }
  };

  const handleTrace = async () => {
    try {
      if (text) {
        setMessage('Tracing in progress...');
        setShowGraph(true); // Set the flag to show the graph

        // Make a GET request to the /trace endpoint
        const response = await axios.get('http://localhost:3000/trace');

        // Handle the response here (assuming response.data contains trace data)
        setSampleTraceData(response.data);

        setMessage('Tracing completed.');
      } else {
        setMessage('Please enter a valid ID for tracing.');
      }
    } catch (error) {
      console.error('Error during tracing:', error);
      setMessage('Error during tracing.');
    }
  };

  return (
    <div>
      <h1>Name of API</h1>
      <textarea
        placeholder="Enter JSON Data"
        value={text}
        onChange={handleTextChange}
        style={{ width: '300px', height: '100px', marginBottom: '10px' }}
      />
      <br />
      <button
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', marginRight: '10px' }}
        onClick={handleSubmit}
      >
        Create Batch
      </button>

      <input
        placeholder="Enter ID"
        onChange={(e) => handleTextChange(e)}
        style={{ width: '100px' }}
      />
      <button
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', marginRight: '10px' }}
        onClick={() => handleGetInformation(text)}
      >
        Get Information
      </button>

      <button
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px' }}
        onClick={handleListAll}
      >
        List All
      </button>

      <button
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', marginRight: '10px' }}
        onClick={handleTrace}
      >
        Trace
      </button>

      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}

      {responseData && (
        <div>
          <h2>Response (Create Batch):</h2>
          <pre>{responseData}</pre>
        </div>
      )}

      {infoResponse && (
        <div>
          <h2>Response (Get Information):</h2>
          <pre>{infoResponse}</pre>
        </div>
      )}

      {listResponse && (
        <div>
          <h2>Response (List All):</h2>
          <pre>{listResponse}</pre>
        </div>
      )}

      {showGraph && sampleTraceData && (
        <Graph data={sampleTraceData} />
      )}
    </div>
  );
};

export default InputPage;
