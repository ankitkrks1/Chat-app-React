import React, { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import useRecorder from "./useRecorder";
import Fileshare from "./Fileshare";

const Chat = ({ socket, user, room }) => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  const [online, setOnline] = useState([]);
  
  const [roomNo,setRoomNo]= useState()
  const audioRef = useRef()
  let [audioURL, setAudioURL ,isRecording, startRecording, stopRecording] = useRecorder();

  const [fileURI,setFileURI] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(room === "")
    {
      await socket.emit("newMsg", { user, room:roomNo, msg, audioURL,fileURI});
    setMsgList((msgList) => [...msgList, { user, room:roomNo, msg, audioURL,fileURI}]);
    setMsg("");
    setAudioURL('')
    setFileURI('')
    
    }
    else{
      await socket.emit("newMsg", { user, room, msg, audioURL,fileURI});
    setMsgList((msgList) => [...msgList, { user, room, msg, audioURL,fileURI}]);
    setMsg("");
    setAudioURL('')
    setFileURI('')
    
    }
    
  };
  
  socket.on("msgList", (data) => {
    setRoomNo(data.room)
    if(data.audioURL === ""){
      setMsgList([...msgList,data])
    }else{
      const blob = new Blob([new Uint8Array(data.audioURL).buffer]);
    const x = {
      user:data.user,
      room:data.room,
      msg:data.msg,
      audioURL: blob,
      fileURI:data.fileURI
    }
    setMsgList([...msgList, x]);
    }
  });
  socket.on("online", (list) => {
    setOnline(list);
    setRoomNo(list[0].room)
  });
  const handleAudio = (e)=>{
    const blob = new Blob(audioURL)
    audioRef.current.src = URL.createObjectURL(blob)
    console.log(audioURL)
  }
  const handleSend = ()=>{
    console.log('sent',room,audioURL)
    socket.emit('send-audio',room,audioURL)
  }

  
  useEffect(()=>{
    socket.on('receive-audio',(a)=>{
      const blob = new Blob([new Uint8Array(a).buffer]);
      console.log('audio',blob)

    })
    
  },[socket])
  useEffect(()=>{
    if(audioURL !== '')
    {
      
      audioRef.current.src = URL.createObjectURL(audioURL)
      console.log(audioURL)
      
    }
  },[audioURL])

 
  return (
    <>
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat {roomNo}</p>
               
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {msgList.map((data) => (
              <div
                className="message"
                id={user === data.user ? "you" : "other"}
              >
                <div key={data.user}>
                  {data.audioURL === "" ?(
                    data.fileURI === '' ? (
                    <div className="message-content">
                    <p>{data.msg}</p>
                  </div>) :(
                    <div className="message-content"> <a href={data.fileURI} download>Download</a></div>
                   
                    )
                  ) : (
                    <div className="message-content">
                      <audio src={URL.createObjectURL(data.audioURL)} controls/>
                      {/* <h1>audio</h1> */}
                    </div>
                  )}
                  <div className="message-meta">
                    {/* <p id="time">{messageContent.time}</p> */}
                    <p id="author">{data.user}</p>
                  </div>
                </div>
              </div>
            ))}

            
          </ScrollToBottom>
        </div>
        <div>
          <form className="chat-footer" onSubmit={handleSubmit}>
            <input
              value={msg}
              type="text"
              placeholder="Message"
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />

            <button type="submit">&#9658;</button>
          </form>
          <div>
            <audio ref={audioRef} controls />
                     
            <div className="audio">
            <button className="btn" onClick={startRecording} disabled={isRecording}>
              start recording
            </button>
            <button className="btn" onClick={stopRecording} disabled={!isRecording}>
              stop recording
            </button>
            </div>
            {/* this is directly sending option devel during testing of app */}
            {/* <button onClick={handleSend}>Send</button> */}
            
          </div>
          <Fileshare uri= {setFileURI}/>

        </div>
        
      </div>
      <div className="online">
        <h3>Current Online</h3>
        <ol>
          {online.map((l) => (
            
            <li key={l.username}>{l.username}</li>
          ))}
        </ol>
      </div>
    </>
  );
};
export default Chat;
