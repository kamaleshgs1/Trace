import React, { useState } from 'react';
import './App.css';
import InputPage from './InputPage';
import NextPage from './NextPage';

function App() {
  const [currentPage, setCurrentPage] = useState('input');
  const [submittedText, setSubmittedText] = useState('');

  const handleTextSubmit = (text) => {
    setSubmittedText(text);
    setCurrentPage('next');
  };

  return (
    <div className="App">
      {currentPage === 'input' && <InputPage onSubmit={handleTextSubmit} />}
      {currentPage === 'next' && <NextPage text={submittedText} />}
    </div>
  );
}

export default App;
