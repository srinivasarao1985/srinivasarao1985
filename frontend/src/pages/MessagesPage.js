import React, { useEffect, useState } from 'react';
import { messageService } from '../services';
import { toast } from 'react-toastify';

export const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messageService.getAllConversations();
      setConversations(response.data.conversations);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load conversations');
      setLoading(false);
    }
  };

  const handleSelectConversation = async (userId) => {
    try {
      const response = await messageService.getConversation(userId);
      setMessages(response.data.messages);
      setSelectedConversation(userId);
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await messageService.sendMessage({
        receiverId: selectedConversation,
        message: messageText,
      });
      setMessageText("");
      handleSelectConversation(selectedConversation);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.conversationsList}>
        <h2>Conversations</h2>
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => handleSelectConversation(conv._id)}
            style={{
              ...styles.conversationItem,
              backgroundColor: selectedConversation === conv._id ? '#f0f0f0' : 'white',
            }}
          >
            <img
              src={conv.user.profilePicture?.url || 'https://via.placeholder.com/50'}
              alt={conv.user.firstName}
              style={styles.avatar}
            />
            <div style={styles.convInfo}>
              <p style={styles.convName}>{conv.user.firstName} {conv.user.lastName}</p>
              <p style={styles.convMessage}>{conv.lastMessage}</p>
            </div>
            {conv.unreadCount > 0 && <span style={styles.badge}>{conv.unreadCount}</span>}
          </div>
        ))}
      </div>

      <div style={styles.chatArea}>
        {selectedConversation ? (
          <>
            <div style={styles.messagesContainer}>
              {messages.map((msg) => (
                <div key={msg._id} style={styles.message}>
                  <p>{msg.message}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={styles.inputForm}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                style={styles.input}
              />
              <button type="submit" style={styles.sendButton}>Send</button>
            </form>
          </>
        ) : (
          <p style={styles.noConversation}>Select a conversation to start messaging</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 60px)',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  conversationsList: {
    flex: '0 0 300px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'auto',
    padding: '15px',
  },
  conversationItem: {
    display: 'flex',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  convInfo: {
    flex: 1,
  },
  convName: {
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  convMessage: {
    margin: '0',
    color: '#666',
    fontSize: '12px',
  },
  badge: {
    backgroundColor: '#e91e63',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
  },
  chatArea: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  message: {
    backgroundColor: '#f0f0f0',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  inputForm: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #ddd',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noConversation: {
    textAlign: 'center',
    padding: '20px',
    color: '#999',
  },
};
