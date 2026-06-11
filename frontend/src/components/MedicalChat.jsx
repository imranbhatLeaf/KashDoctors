import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MedicalChat.css';

const MedicalChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am KashDocs AI. How can I help you with your medical questions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Only scroll if there's more than the initial message
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/predict/chat`, { 
        message: userMessage,
        session_id: sessionId 
      });
      
      const { answer, session_id, recommended_specialty } = response.data.data;
      setSessionId(session_id);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: answer,
        specialty: recommended_specialty
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the service. Please make sure the AI service is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const viewSpecialists = (specialty) => {
    navigate('/doctors', { state: { specialty } });
  };

  const TypingIndicator = () => (
    <div className="message-row assistant">
      <div className="message-bubble typing-bubble">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="medical-chat-card">
      <div className="chat-header">
        <div className="header-info">
          <div className="bot-avatar">
            <Bot size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="chat-title">Medical Assistant</h3>
            <div className="chat-status">
              <span className="status-dot pulse"></span>
              <span>AI is online</span>
            </div>
          </div>
        </div>
        <button 
          className="clear-chat-btn"
          onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am KashDocs AI. How can I help you today?' }])}
          title="Clear Conversation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role} fade-in`}>
            <div className="message-bubble">
              <div className="message-content">{msg.content}</div>
              
              {msg.specialty && (
                <div className="specialty-suggestion-card">
                  <div className="suggestion-icon">⚕️</div>
                  <div className="suggestion-content">
                    <p className="suggestion-label">Recommended Specialist</p>
                    <p className="suggestion-name">{msg.specialty}</p>
                    <button 
                      className="view-spec-btn"
                      onClick={() => viewSpecialists(msg.specialty)}
                    >
                      Book Appointment
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      
      <form className="chat-input-container" onSubmit={handleSend}>
        <div className="input-inner">
          <input
            type="text"
            className="chat-input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe symptoms or ask a health question..."
            disabled={isLoading}
          />
          <button type="submit" className="chat-send-btn" disabled={isLoading || !input.trim()}>
            <Send size={18} />
          </button>
        </div>
        <p className="chat-disclaimer">
          AI provides info only — not medical advice.
        </p>
      </form>
    </div>
  );
};

export default MedicalChat;
