import { useParams, useNavigate } from "react-router-dom";
import {  useEffect, useState, useRef  } from "react";
import { useSelector } from "react-redux";
import React from "react";

import moment from 'moment';
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
import SendIcon from "../assets/icons/send.svg"


const ChatPage = () => {
    const { uid } = useSelector(state=>state.user.data.userData);
    const navigate = useNavigate();
    const { id:chatId } = useParams();
    const InputField = useRef();

    const [dropdown, setDropdown] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [file, setFile] = useState(null);
    const [recorder, setRecorder] = useState(false);
    const [camera, setCamera] = useState(false);
    const [chatData, setChatData] = useState({});
    const [time, setTime] = useState("");
    const [pending, setPending] = useState(true);
    const [parsed, setParsed] = useState([])

    const chatContainer = useRef();

    const chatRef = doc(chatColRef, chatId);

    const handleChange = (e) => {
        setMessage(e.target.innerText);
    }

    const handleDropDown = () => {
        setDropdown(dropdown=> !dropdown);
    }

    const appendImage = (file, task) => {
        const reader = new FileReader();
		reader.readAsDataURL(file);
        reader.onload = function (e) {
            const src = e.target.result;
            const d = new Date();
            const seconds = d.getSeconds();
            const milli = d.getMilliseconds();
            setMessageList(message=> [{
                message_type: "image",
                message_data: src,
                sender: uid,
                status: "sending",
                createdAt:{
                    seconds: seconds
                }
            }, ...message])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        InputField.current.innerText = "";
            await addDoc(messagesColRef,{
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
        setMessage("");
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
            await checkUser();
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

    const parseDate = (arr) => {
        return arr.map(row => {
            let date = moment(row.createdAt * 1000).format("MMMM Do");
            return {...row, date}
        })
    }

    const parseMessages = (arr) => {
        let newArray = parseDate(arr);
        let map = new Map();
        let tempArray = [];
        for(let i = 0; i < newArray.length ; i++) {
            tempArray.push(newArray[i]);

            if (i + 1 === newArray.length) {
                map.set(newArray[i].date, tempArray);
            }

            else if (newArray[i].date !== newArray[i+1].date){
                map.set(newArray[i].date, tempArray);
                tempArray = [];
            }
        }
        return map;
    }

    useEffect(()=>{
        if (chatContainer.current.firstElementChild){
            chatContainer.current.firstElementChild.scrollIntoView(true);
        }
        setParsed(parseMessages(messageList));

    },[messageList])

    useEffect(()=>{
        if(chatData.query_id) {
            if(chatData.lastUpdatedAt.seconds) {
                setTime(moment(chatData.lastUpdatedAt.seconds * 1000).fromNow())
            }
        }
    },[chatData])

    useEffect(()=>{
        console.log(parsed)
    })

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
                {[...parsed.keys()].map((key, i)=>{
                    return (
                        <React.Fragment key={i}>
                        {[...parsed.get(key)].map((value, i)=>(
                            <ChatMessage data={value} key={i} />
                        ))}
                        <div className="mx-auto my-4 p-2 bg-cyan-200 rounded-xl">{key}</div>
                        </React.Fragment>
                    )
                }         
                )}
                {(!messageList.length && pending) && [0,1,2,3,4].map((item,i)=>(
                    <SkeletonChat key={i} />
                ))}
            </div>

            {file && <SendFile file={file} setFile={setFile} chatRef={chatRef} chatId={chatId} uid={uid} appendImage={appendImage} />}
            {recorder && <AudioBar setRecorder={setRecorder} chatRef={chatRef} chatId={chatId} uid={uid} />}
            {camera && <SendFile file={camera} setFile={setCamera} chatRef={chatRef} chatId={chatId} uid={uid} appendImage={appendImage} />}

            <div id="footer" className="min-h-[55px] w-[100%] absolute bottom-0 left-0 p-2 bg-white">
                <form>
                    <div className="flex h-[100%] w-[100%] gap-2 items-center cursor-pointer">
                        <span onClick={handleDropDown} ><img src={PlusIcon} className="nav-link-img shrink-0 w-[30px]"/></span>
                        <span className="relative w-full">
                            <div ref={InputField} contentEditable="true"  onInput={e=>handleChange(e)} className="inline-block p-2 px-3 w-full min-h-[42px] rounded-3xl border-[1px] border-solid border-black break-all max-h-[100px] overflow-auto" title="Write your message here..." innertext={message} ></div>
                        </span>
                        {message.length ? (
                            <div onClick={handleSubmit} className="shrink-0">
                                <img src={SendIcon} className="w-[35px] h-[35px]" />
                            </div>
                        ) : (
                            <>
                            <span className="shrink-0 w-[30px]">
                                <label htmlFor="camera"><img src={CameraIcon} className="nav-link-img cursor-pointer" /> </label>
                                <input type="file" capture="user" id="camera" className="hidden" accept="video/*,image/*" onChange={(e)=>setCamera(e.target.files[0])} />
                            </span>
                            <span onClick={()=>setRecorder(true)} className="w-[30px] shrink-0"><img src={MicIcon} className="nav-link-img cursor-pointer" /></span>
                            </>
                        )}    
                    </div>
                </form>
            </div>
        </div>
        {dropdown && <Dropdown handleDropDown={handleDropDown} setFile={setFile} chatId={chatId} uid={uid} chatRef={chatRef} />}
        </>
    );
}
 
export default ChatPage;