import React, { useState } from 'react'; // Removed useRef
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState(''); // Track conversation history

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sent: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    setInput('');

    try {
      const response = await axios.post('http://10.0.2.2:5000/ask', {
        query: userInput,
        conversation_history: conversationHistory,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || 'No response from server.',
        sent: false,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Update conversation history
      setConversationHistory(response.data.conversation_history);
    } catch (error) {
      console.error('Error contacting backend:', error.message);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: '⚠️ Could not reach chatbot.',
        sent: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View
      animation={item.sent ? 'fadeInRight' : 'fadeInLeft'}
      duration={500}
      style={[
        styles.messageContainer,
        item.sent ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sent ? '#fff' : '#000' },
        ]}
      >
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => console.log('Mic tapped')}>
          <Ionicons name="mic-outline" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 10,
  },
});
