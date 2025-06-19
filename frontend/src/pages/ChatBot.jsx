import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ChatBot = () => {
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize state with data from localStorage if it exists
  const [sessionId, setSessionId] = useState(() => {
    const savedSessionId = localStorage.getItem('currentSessionId');
    return savedSessionId || uuidv4();
  });

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
    try {
      const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];
      console.log('Loaded messages from storage:', parsedMessages);
      return parsedMessages;
    } catch (e) {
      console.error('Error parsing saved messages:', e);
      return [];
    }
  });

  const [input, setInput] = useState('');

  // Debug logging for state changes
  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
    console.log('Saved messages to storage:', messages);
  }, [messages, sessionId]);

  useEffect(() => {
    localStorage.setItem('currentSessionId', sessionId);
    console.log('Current session ID:', sessionId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);
    console.log('Started new session:', newSessionId);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    setLoading(true);
    setError(null);
    
    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      console.log('Sending message:', input);
      console.log('Current conversation history:', updatedMessages);

      const response = await axios.post('http://localhost:5000/api/gemini', {
        prompt: input,
        conversationHistory: updatedMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      });

      console.log('Received response:', response.data);

      if (response.data && response.data.response) {
        const botMessage = { sender: 'bot', text: response.data.response };
        setMessages([...updatedMessages, botMessage]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setError(error.response?.data?.message || error.message || 'Unknown error');
      const errorMessage = { 
        sender: 'bot', 
        text: `Error: ${error.response?.data?.message || error.message || 'Unknown error'}` 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat Session: {sessionId.slice(0, 8)}</h2>
          <button
            onClick={startNewSession}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            New Session
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg mb-4 p-4">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              Start a conversation by typing a message below.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white ml-auto max-w-[80%]' 
                    : 'bg-gray-200 text-gray-800 mr-auto max-w-[80%]'
                }`}
              >
                {message.text}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            className={`p-2 ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-lg`}
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;