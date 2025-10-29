import React, { useState,useEffect,useRef } from 'react';
//https://www.npmjs.com/package/react-stomp
import SockJsClient from 'react-stomp';

const SOCKET_URL = process.env.REACT_APP_HOST+'/ws-message';

const SocketFunctions = (props) => {
  const [message, setMessage] = useState('waiting from server message...');
  const [countRetry, setCountRetry] = useState(0);
  useEffect(() => {
     console.log("reloading");
  }, [countRetry]); 

  const clientRef = useRef();
  let onConnected = () => {
    console.log("Connected!!")
    setMessage('waiting from server message...')
  }

  let onDisconnect = () => {
    console.log("DIS-Connected!!")
    setMessage("offline");
  }

  let onMessageReceived = (msg) => {
    setMessage(msg.time +" "+msg.message);
  }
  let onRetryInterval = () => {
    setCountRetry(countRetry+1);
    setMessage("retry "+countRetry);
  }
  let sendMessage = (msg) => {
    console.log("send message....")
    clientRef.current.sendMessage('/sendMessage', msg);
  }
  let auth_headers={
    "token":"admin_token"	
  };
  return (
    <div>
      <SockJsClient
        ref={ (client) => { clientRef.current = client }}
        url={SOCKET_URL}
        headers={auth_headers}
        topics={['/topic/message']}
        getRetryInterval={onRetryInterval}
        onConnect={onConnected}
        onDisconnect={onDisconnect}
        onMessage={msg => onMessageReceived(msg)}
        debug={false}
      />
      <div>{message}</div>
     {/*
      <div><button onClick={()=> setCountRetry(countRetry+1)}>+</button>
      <button onClick={()=> sendMessage("msg:"+countRetry)}>M</button></div>
  */} 
      
    </div>
  );
}

export default SocketFunctions;