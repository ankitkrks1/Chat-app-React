import React, { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import Audio from "./Audio";
// const socket = io.connect("http://localhost:3001");
// const socket = io.connect("http://192.168.29.238:3001");
const socket = io.connect()

const Join = () => {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [show, setShow] = useState(true);

  const [showHow,setShowHow] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user, room);
    if ((user !== "")) {
      socket.emit("user", { user, room },(error)=>{
        setShow(true)
       alert(error)

      });
      setShow(false);
    }
   
  };
  return (
    <div className="App">
      {show ? (
        < div className="joinChatContainer">
          <h1>Join a Room</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              type="text"
              placeholder="room"
              onChange={(e) => setRoom(e.target.value)}
            />
            <button type="sumbit">Join</button>

          </form>
          <p>If Room No. not entered than you will be joined in random room</p>
          <div>
            <p>The page is Developed By Mr. Ankit Kumar Kashyap</p>
            <p><a href="mailto:ankit.kr.ks@gmail.com">Mail Me</a></p>
            <p>Using this Webapp you can send msg and voice msg to any person in the world,
              we dont' store any msg records its totally secure and peer to peer but we can track you if needed for 
              security reasons, so please respect the Privacy. </p>
            
          </div>
        </div >
      ) : (
        <Chat className="App-1" socket={socket} user={user} room={room} />
      )}

      
    </div>
  );
};

export default Join;
