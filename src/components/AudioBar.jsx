import SendIcon from "../assets/icons/send.svg";
import CloseIcon from "../assets/icons/close.svg";
import { useEffect, useRef, useState } from "react";
import useInterval from "../customHooks/useInterval";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/storage";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { messagesColRef } from "../firebase/firestore";
import uniqid from 'uniqid';

const AudioBar = ({setRecorder, chatRef, chatId, uid}) => {

    const [file, setFile] = useState(null);

    const [error, setError] = useState(null);
    const [status, setStatus] = useState("starting");
    const [time, setTime] = useState(0);

    const closeButton = useRef();
    const sendButton = useRef();

    const handleSuccess = function (stream) {
        const options = {mimeType: 'audio/webm'};
        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);
    
        mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) recordedChunks.push(e.data);
            console.log(e.data);
        });

        mediaRecorder.addEventListener('start', e=>{
            setStatus("Recording");
        })
    
        mediaRecorder.addEventListener('stop', function() {
            console.log("Recording has been stopped");  
            setStatus("stopped");
            stream.getTracks() // get all tracks from the MediaStream
            .forEach( track => track.stop() ); 
        });

        sendButton.current.addEventListener('click', (e)=>{
            e.target.style.display = "none";

            mediaRecorder.stop();

            const mediaBlob = new Blob(recordedChunks, {type: mediaRecorder.mimeType});

            const audioFile = new File([mediaBlob], "myFile", {
                type: "audio/webm"
            });

            setFile(audioFile);
        })

        closeButton.current.addEventListener('click', ()=>{
            console.log("close button clicked");
            mediaRecorder.stop();
            closeAudioBar();
        })
    
        mediaRecorder.start(1000);
      };

      const handleClick = () => {
        const fileRef = ref(storage, `audios/${uniqid()}`);

            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on('state_changed', 
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setStatus('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              // Handle unsuccessful uploads
              setError(error);
            }, 
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                await savetoDb(downloadURL);
                closeAudioBar();
              });
            }
          );
    }  

    const savetoDb = async (url) => {
        try{
            await addDoc(messagesColRef, {
                chat_id: chatId,
                sender: uid,
                message_type: "audio",
                message_data: url,
                createdAt: serverTimestamp(),
            }) 
            await updateDoc(chatRef, {
                lastUpdatedAt: serverTimestamp(),
                lastUpdatedType: "audio"
            })
            setFile(null);
        } catch (err) {
            setError("Could not send File");
        }
    }

    const closeAudioBar = () => {
        setRecorder(false);
    }

    useEffect(()=>{
        navigator.mediaDevices
        .getUserMedia({audio: true, video: false})
        .then((stream)=> handleSuccess(stream))
        .catch((err)=>{
            console.log(err)
            setError("Can not connect to microphone");
        });
    },[])

    useEffect(()=>{
        if(file) handleClick();
    }, [file])

    return (
    <div className="absolute bottom-0 left-0 h-[60px] w-full flex justify-between p-2 items-center z-30 bg-white gap-2">
        <span ref={closeButton}><img src={CloseIcon} alt="Close" className="nav-link-img cursor-pointer" /></span>
        <span className="overflow-hidden flex-grow">{status}</span>
        <button ref={sendButton}><img src={SendIcon} alt="Send" className="nav-link-img cursor-pointer"/></button>
    </div>
    );
}
 
export default AudioBar;