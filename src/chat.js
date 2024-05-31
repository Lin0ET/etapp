import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);
  let thread = [];

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/page2');
  };



  const sendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prevHistory => [...prevHistory, { author: 'You', text: message }]);
    thread.push({ role: 'user', parts: [{ text: message }] });
    console.log(thread);
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents: thread }),
    })
      .then(response => response.json())
      .then(data => {
        const msg = data.candidates[0].content.parts[0].text;
        setChatHistory(prevHistory => [...prevHistory, { author: 'Bot', text: msg }]);
        thread.push({ role: 'model', parts: [{ text: msg }] });
        console.log(thread);
      })
      .catch(error => {
        console.error('Error:', error);
        setChatHistory(prevHistory => [...prevHistory, { author: 'Bot', text: 'Error: ' + error }]);
      });

    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleResetConversation = () => {
    setChatHistory([]);
  };
  return (
    <div className="App">
      <div style={{ marginBottom: '1rem' }}>
        <button className="reset-button" onClick={handleNavigate}>圖片模式</button>

      </div>
      <a href='https://emtech.cc/post/gemini-api/'><h1 h>Gemini API 陪聊</h1></a>


      <div id="chatHistory" ref={chatHistoryRef}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message-container ${chat.author === 'You' ? 'user' : 'bot'}`}>
            <div className="author">{chat.author}:</div>
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: chat.text }}
            />
          </div>
        ))}
      </div>
      <div className="inputs">
        <input type="password" id="apiKey" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <input
          type="text"
          id="messageInput"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
        <button className="reset-button" onClick={handleResetConversation}>↻</button>
      </div>

    </div>

  );
}

export default App;
