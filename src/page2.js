import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Page2() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatHistoryRef = useRef(null);
  let thread = [];

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !selectedImage) return;

    setChatHistory(prevHistory => [
      ...prevHistory,
      { author: 'You', text: message, image: selectedImage },
    ]);

    const parts = [];
    if (message.trim()) {
      parts.push({ text: message });
    }
    if (selectedImage) {
      parts.push({
        inline_data: {
          mime_type: selectedImage.split(';')[0].split(':')[1],
          data: selectedImage.split(',')[1],
        },
      });
    }

    thread.push({ role: 'user', parts });

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`, {
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
      })
      .catch(error => {
        console.error('Error:', error);
        setChatHistory(prevHistory => [...prevHistory, { author: 'Bot', text: 'Error: ' + error }]);
      });

    setMessage('');
    setSelectedImage(null);
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
        <button className="reset-button" onClick={handleNavigate}>文字模式</button>
      </div>

      <h1>Gemini API 图片模式</h1>

      <div id="chatHistory" ref={chatHistoryRef}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message-container ${chat.author === 'You' ? 'user' : 'bot'}`}>
            <div className="author">{chat.author}:</div>
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: chat.text }}
            />
            {chat.image && (
              <div className="image-container">
                <img src={chat.image} alt="Uploaded" style={{ maxHeight: '100px', width: 'auto' }} />
              </div>
            )}
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
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button className="send-button" onClick={sendMessage}>Send</button>
        <button className="reset-button" onClick={handleResetConversation}>↻</button>
      </div>
    </div>
  );
}

export default Page2;
