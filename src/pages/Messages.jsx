import Message from '../components/Message';
import { Link } from 'react-router-dom';
import MenuIcon from '../assets/icons/menu.svg'
import Navbar from '../components/Navbar';
import PlusIcon from "../assets/icons/plus.svg";

import { query, where, onSnapshot, orderBy} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { chatColRef } from '../firebase/firestore';
import {  useSelector  } from "react-redux";
import NewChatMenu from '../components/NewChatMenu';
import SkeletonCard from '../components/Skeletons/SkeletonMessage';

const Messages = () => {
   const {  uid } = useSelector(state=>state.user.data.userData);
    const [chats, setChats] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(()=>{
        if (uid) {
            const chatsQuery = query(chatColRef, where("users", "array-contains", uid), orderBy("lastUpdatedAt", "desc"));
            onSnapshot(chatsQuery, (snapshot)=>{
                let chats = [];
                snapshot.docs.forEach(doc=>{
                    chats.push({...doc.data(), docId:doc.id})
                })
                if(chats.length){
                    setPending(false)
                    setChats([...chats])
                }
                
            })
        }
    },[uid])

    const handleClick = () => {
        setOpenMenu(openMenu => !openMenu);
    }

    return ( 
        <>
        <Navbar />
        <div className="page-container">
            <div className="page-header flex justify-center h-[100px]">
                <h3 className=" my-7 mx-auto font-body font-medium text-xl">MESSAGES</h3>
            </div>
            <div className='absolute top-6 left-5 cursor-pointer w-[30px] h-[30px]' ><img src={MenuIcon}/></div>
            <div className='flex justify-around border-b-2 border-solid ' id='subNav'>
                <Link to={'/'} className="sub-nav-link">Leads</Link>
                <Link to={'/'} className="sub-nav-link active ">Messages</Link>
                <Link to={'/'} className="sub-nav-link">Requests</Link>
            </div>
            <div id="message-list" className='overflow-y-auto h-[calc(100vh-175px)] pb-[50px]'>
                {chats && chats.map((chat, i)=>(
                    <Message key={i} data={chat} />
                ))}
                {pending && [0,1,2,3,4].map((chat, i)=>(
                    <SkeletonCard key={i} />
                )) }
            </div>
            <div onClick={handleClick} className='absolute rounded-[50%] top-6 right-5 cursor-pointer'>
                <img src={PlusIcon} className="w-[30px] h-[30px]"/>
            </div>
        </div>
        {openMenu && <NewChatMenu setOpenMenu={setOpenMenu} uid={uid} /> }
        </>
    );
}
 
export default Messages;