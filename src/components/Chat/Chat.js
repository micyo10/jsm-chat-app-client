import React, {useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // const ENDPOINT = 'https://myo-react-chat.herokuapp.com/';

  const ENDPOINT = 'localhost:5000';


  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    // console.log(location.search);
    // console.log(name , room);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    // console.log(socket);
    // testing errors
    socket.emit('join', { name: name, room: room }, () => {
      // alert(error);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      // add all new messages to existing array of messages
      setMessages([...messages, message]);
    })
  // run only when messages array changes
  }, [messages]);

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(message, messages);

  return (

    // <h1>Chat</h1>
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat;
