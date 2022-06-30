import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useSelector  } from "react-redux";
import MessageTag from "./MessageTag";
import moment from "moment";



const Message = ({data}) => {

    const [mdata, setMdata] = useState();

    const { uid } = useSelector(state=>state.user.data.userData);

    const navigate = useNavigate();

    const shortenId = (address, length) => {
        if (length === 5) {
            return `${address.slice(0, 5)}...${address.slice(address.length - 5)}`;
          }
        
          return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
    }
    
    const parseData = (data) => {
        const chatId = data.docId;
        let senderId = data.users.find(id=> id !== uid);
        let lastUpdatedType;
        let d;
        let preview;

        senderId = shortenId(senderId, 9);

        if (data.lastUpdatedAt){
            d = new Date(data.lastUpdatedAt.seconds * 1000);
        }
        if (data.lastUpdatedType) {
            lastUpdatedType = data.lastUpdatedType;
            if(lastUpdatedType === "text") preview = data.preview;
        }
        else{
            d = new Date();
        } 
        const date = moment(d).format('h:mm a MMMM Do YYYY'); 
        return { chatId, senderId, date, lastUpdatedType, preview }
    }

    useEffect(()=>{
        setMdata(parseData(data));
    },[data])

    useEffect(()=>console.log(mdata), [mdata])

    const handleClick = (id) => {
        navigate(`/chat/${id}`);
    }

    return ( 
        <>
            {mdata && (
                <div className="border-b-2 border-solid w-[90%] mx-auto mt-4 relative cursor-pointer" onClick={()=>handleClick(mdata.chatId)}>
                    <div><span className="text-[15px]">Customer</span> - <span className="text-[15px]">{mdata.senderId}</span></div>
                    <div><span className="font-medium text-[15px]">Real Estate</span></div>
                    <MessageTag type={mdata.lastUpdatedType} preview={mdata.preview} />
                    <div className="flex justify-end"><span className="text-xs">{mdata.date}</span></div>
                    {/* {mdata.unread.number > 0 && <div className="absolute bg-cyan-500 top-[30%] right-5 w-[16px] h-[16px] flex justify-center items-center rounded-full text-white"><span className="text-xs">{mdata.unread.number}</span></div>} */}
                </div>
            )}
        </>
        
    );
}
 
    export default Message;