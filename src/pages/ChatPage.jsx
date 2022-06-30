import { useParams, useNavigate } from "react-router-dom";
import {  useEffect, useState, useRef  } from "react";
import { useSelector } from "react-redux";

import moment from 'moment'
import PlusIcon from "../assets/icons/plus.svg";
import CameraIcon from "../assets/icons/camera.svg"
import MicIcon from "../assets/icons/mic.svg"
import Dropdown from "../components/Dropdown";
import BackButton from "../assets/icons/arrow.svg"
import MoreButton from "../assets/icons/more.svg"
import { addDoc, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { chatColRef, messagesColRef } from "../firebase/firestore";
import ChatMessage from "../components/ChatMessage";
import SendFile from "../components/SendFile";
import AudioBar from "../components/AudioBar";
import SkeletonChat from "../components/Skeletons/SkeletonChat";


const ChatPage = () => {
    const { uid } = useSelector(state=>state.user.data.userData);
    const navigate = useNavigate();
    const { id:chatId } = useParams();

    const [dropdown, setDropdown] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [file, setFile] = useState(null);
    const [recorder, setRecorder] = useState(false);
    const [camera, setCamera] = useState(false);
    const [chatData, setChatData] = useState({});
    const [time, setTime] = useState("");
    const [pending, setPending] = useState(true);

    const chatContainer = useRef();

    const chatRef = doc(chatColRef, chatId);

    const handleDropDown = () => {
        setDropdown(dropdown=> !dropdown);
    }

    const appendImage = (file, task) => {
        const reader = new FileReader();
		reader.readAsDataURL(file);
        reader.onload = function (e) {
            const src = e.target.result;
            setMessageList(message=> [{
                message_type: "image",
                message_data: src,
                sender: uid,
                status: "sending"
            }, ...message])
        }

        task.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        })
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const messageRef = await addDoc(messagesColRef,{
            chat_id: chatId,
            sender: uid,
            message_type: "text",
            message_data: message,
            createdAt: serverTimestamp()
        });
        await updateDoc(chatRef, {
            lastUpdatedAt: serverTimestamp(),
            lastUpdatedType: "text",
            preview: message
        })
        setMessage("")
    }

    const goBack = () => {
        navigate(-1);
    }

    const checkUser = () => {
        return new Promise(async (resolve, reject)=>{
            try{
                const docSnap = await getDoc(chatRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.users.includes(uid)){
                        setChatData({...data});
                        resolve(data);
                    }
                    else reject("User does not have permission")
                }
                else {
                    reject("Chat Does not exist")
                }
            } catch(err) {
                reject(err.message)
            }
        })
    }

    const getMessages = async () => {
        try {
            const checked = await checkUser();
            const chatQuery = query(messagesColRef, where("chat_id", "==", chatId), orderBy("createdAt", "desc"), limit(30));
            onSnapshot(chatQuery, (snapshot)=>{

            let messages = [];

            snapshot.docs.forEach(doc=>{
                messages.push({...doc.data(), docId:doc.id})
            })

            if(messages.length){
                setMessageList([...messages])
            }
            setPending(false);
            })
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        getMessages();
    },[uid])

    useEffect(()=>{
        if (chatContainer.current.firstElementChild){
            chatContainer.current.firstElementChild.scrollIntoView(true);
            console.log({element: chatContainer.current.firstElementChild})
        }
    },[messageList])

    console.log(chatData);

    useEffect(()=>{
        if(chatData.query_id) {
            console.log("here")
            if(chatData.lastUpdatedAt.seconds) {
                console.trace("reched here")
                setTime(moment(chatData.lastUpdatedAt.seconds * 1000).fromNow())
            }
        }
    },[chatData])

    return ( 
        <>
        <div>
            <div id="header" className="flex items-center justify-between w-[100%] mx-auto border-b-2 border-solid p-2 h-[60px]">
                <div className="cursor-pointer" onClick={goBack} ><img src={BackButton} className="nav-link-img" /></div>
                <div className="flex flex-col justify-center items-center">
                    <span id="user-id">03xxxxxxx343</span> 
                    <span className="text-[8px]">{time}</span>
                </div>
                <div><img src={MoreButton} alt="" className="nav-link-img"/></div>
            </div>

            <div ref={chatContainer} id="chat-container" className="h-[calc(100vh-60px-55px)] overflow-y-auto flex flex-col-reverse p-2">
                {messageList.map((item, i)=>(
                    <ChatMessage key={i} data={item} />
                ))}
                {(!messageList.length && pending) && [0,1,2,3,4].map((item,i)=>(
                    <SkeletonChat key={i} />
                ))}
            </div>

            {file && <SendFile file={file} setFile={setFile} chatRef={chatRef} chatId={chatId} uid={uid} appendImage={appendImage} />}
            {recorder && <AudioBar setRecorder={setRecorder} chatRef={chatRef} chatId={chatId} uid={uid} />}
            {camera && <SendFile file={camera} setFile={setCamera} chatRef={chatRef} chatId={chatId} uid={uid} appendImage={appendImage} />}

            <div id="footer" className="h-[55px] w-[100%] absolute bottom-0 left-0 p-2 bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="flex h-[100%] w-[100%] gap-2 items-center cursor-pointer">
                        <span onClick={handleDropDown} ><img src={PlusIcon} className="nav-link-img"/></span>
                        <span className="flex-grow">
                            <input value={message} onChange={e=>setMessage(e.target.value)} className="p-2 w-[100%] h-[42px] rounded-3xl border-[1px] border-solid border-black" placeholder="Write your message here..."  />
                        </span>
                        <span>
                            <label htmlFor="camera"><img src={CameraIcon} className="nav-link-img cursor-pointer" /> </label>
                            <input type="file" capture="user" id="camera" className="hidden" accept="video/*,image/*" onChange={(e)=>setCamera(e.target.files[0])} />
                        </span>
                        <span onClick={()=>setRecorder(true)}><img src={MicIcon} className="nav-link-img cursor-pointer" /></span>
                    </div>
                </form>
            </div>
        </div>
        {dropdown && <Dropdown handleDropDown={handleDropDown} setFile={setFile} chatId={chatId} uid={uid} chatRef={chatRef} />}
        </>
    );
}
 
export default ChatPage;