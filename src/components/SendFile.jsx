import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect, useRef } from "react";
import { storage } from "../firebase/storage";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { messagesColRef } from "../firebase/firestore";
import uniqid from 'uniqid';

import SendIcon from "../assets/icons/send.svg";
import CloseIcon from "../assets/icons/close.svg";

const SendFile = ({file, setFile, chatRef, chatId, uid, appendImage }) => {
    const [error, setError] = useState(null);
    const [percent, setPercent] = useState(0);
    const [status, setStatus] = useState("pending");
    const [type,setType] = useState("");

    const closeButton = useRef();

    useEffect(()=>{
      let fileType = file.type.split('/')[0];

      if (fileType !== "image" && fileType !== "video"){
        setType("file");
      }
      else setType(fileType);
    },[])

    const handleClick = () => {
        
        const fileRef = ref(storage, `${type}s/${uniqid()}`);

        const uploadTask = uploadBytesResumable(fileRef, file);

        if(type === "image"){
          appendImage(file, uploadTask);
          setFile(null);
        }

        closeButton.current.addEventListener('click', (e)=>{
          uploadTask.cancel();
        })

        uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setPercent('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              setStatus('paused')
              break;
            case 'running':
              setStatus('running');
              break;
          }
          if(progress === 100) setStatus("done");
        }, 
        (error) => {
          // Handle unsuccessful uploads
          setError(error);
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            savetoDb(downloadURL);
          });
        }
      );
    }

    const savetoDb = async (url) => {
        try{
            await addDoc(messagesColRef, {
                chat_id: chatId,
                sender: uid,
                message_type: type,
                message_data: url,
                createdAt: serverTimestamp(),
                preview: file.name
            }) 
            await updateDoc(chatRef, {
                lastUpdatedAt: serverTimestamp(),
                lastUpdatedType: type,
            })
            setFile(null);
        } catch (err) {
            setError("Could not send File");
        }
    }

    useEffect(()=>{
      if(status === "done") setFile(null); 
    }, [status])

    return ( 
        <div className="absolute bottom-0 left-0 h-[60px] w-full flex justify-between p-2 items-center z-30 bg-white gap-2">
            <span onClick={()=>setFile(null)} ref={closeButton} className="basis-8"><img src={CloseIcon} alt="Close" className="nav-link-img cursor-pointer" /></span>
            <span className="overflow-hidden flex-grow">
              {status === "pending" && <span>Send {file.name}</span>}
              {status === "running" && <span>{percent}</span>} 
            </span>
            <button onClick={handleClick} className="basis-8"><img src={SendIcon} alt="Send" className="nav-link-img cursor-pointer"/></button>
        </div>
    );
}
 
export default SendFile;