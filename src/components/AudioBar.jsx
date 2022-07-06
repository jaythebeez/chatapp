import SendIcon from "../assets/icons/send.svg";
import CloseIcon from "../assets/icons/close.svg";
import { useEffect, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/storage";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { messagesColRef } from "../firebase/firestore";
import uniqid from 'uniqid';

const AudioBar = ({setRecorder, chatRef, chatId, uid}) => {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("starting");

    let closeButton = useRef();
    const sendButton = useRef();

    const closeBar = (stream,recorder) => {
        if(recorder && recorder.state !== "inactive") {
            recorder.stop(); 
        }
        if(stream){
            stream.getTracks() // get all tracks from the MediaStream
            .forEach(track => track.stop());
        }
        closeAudioBar();
    }

    const handleSuccess = function (stream) {
        const options = {mimeType: 'audio/webm'};
        const recordedChunks = [];

        const mediaRecorder = new MediaRecorder(stream, options);
    
        mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) recordedChunks.push(e.data);
            console.log(e.data)
        });

        mediaRecorder.addEventListener('start', e=>{
            setStatus("Recording");
        })
    
        mediaRecorder.addEventListener('stop', function() { 
            setStatus("stopped");
            stream.getTracks() // get all tracks from the MediaStream
            .forEach(track => track.stop()); 
        });

        closeButton.current.addEventListener('click', e=>closeBar(stream,mediaRecorder));

        sendButton.current.addEventListener('click', (e)=>{
            e.target.style.display = "none";

            mediaRecorder.stop();

            const mediaBlob = new Blob(recordedChunks, {type: mediaRecorder.mimeType});

            const audioFile = new File([mediaBlob], "myFile", {
                type: "audio/webm"
            });

            handleClick(audioFile);

            stream.getTracks() // get all tracks from the MediaStream
            .forEach(track => track.stop()); 
        })
    
        mediaRecorder.start(1000);
      };

      const handleClick = (file) => {
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
        } catch (err) {
            setError("Could not send File");
        }
    }

    const closeAudioBar = () => {
        setRecorder(false);
    }

    const startAudio = () => {
        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
          }
          
          // Some browsers partially implement mediaDevices. We can't just assign an object
          // with getUserMedia as it would overwrite existing properties.
          // Here, we will just add the getUserMedia property if it's missing.
          if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
          
              // First get ahold of the legacy getUserMedia, if present
              const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          
              // Some browsers just don't implement it - return a rejected promise with an error
              // to keep a consistent interface
              if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
              }
          
              // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
              return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            }
          }
          
          navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream)=>handleSuccess(stream))
          .catch(function(err) {
            setError("Can not connect to Microphone");
            console.log(err);
          });
    }  

    let start = false;
    useEffect(()=>{
        if(!start) {
            start = true;
            console.log('starting audio');
            startAudio();
        }
    },[])


    return (
    <div className="absolute bottom-0 left-0 h-[60px] w-full flex justify-between p-2 items-center z-30 bg-white gap-2">
        <span ref={closeButton}><img src={CloseIcon} alt="Close" className="nav-link-img cursor-pointer" /></span>
        {error ? (
            <>
                <span className="overflow-hidden flex-grow">{error}</span>
            </>
        ) : (
            <>
                <span className="overflow-hidden flex-grow">{status}</span>
                <button ref={sendButton}><img src={SendIcon} alt="Send" className="nav-link-img cursor-pointer"/></button>
            </>
        )}
    </div>
    );
}
 
export default AudioBar;