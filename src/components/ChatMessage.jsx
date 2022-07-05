import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import DownloadBtn from "../assets/icons/download.svg";
import AudioPlayer from "./AudioPlayer";
import ExpandImage from "./ExpandImage";

const ChatMessage = ({data}) => {
    const { uid } = useSelector(state=>state.user.data.userData);
    const [time, setTime] = useState("00:00");
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        const date = moment(data.createdAt * 1000).format("h:mm");
        setTime(date);
    },[])

    const handleExpand = (e) => {
        console.log(e)
        setOpen(false);
        console.log(open)
    }

    const isSender = uid === data.sender ? true : false;

    const renderText = (data) => {
        return (
            <>
                <div className={isSender ? "flex flex-col sender max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 rounded-2xl text-sm break-all" : 
                                            "flex flex-col receiver max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 rounded-2xl text-sm break-all"}>
                    <div className="" >{data.message_data}</div>
                    <div className="text-end"><span className="text-[10px]">{time}</span></div>
                </div>
            </>
        )
    }

    const renderImage = (data) => {
        return (
            <>
                <div className={isSender ? "sender max-w-[60%] rounded-2xl relative cursor-pointer" : "receiver max-w-[90%] rounded-2xl relative cursor-pointer"} onClick={()=>setOpen(true)}>
                    <img src={data.message_data} className="w-full object-contain max-h-[300px] rounded-xl" />
                    {data.status && <div className="spinner"></div>}
                </div>
                {open && <ExpandImage src={data.message_data} handleExpand={handleExpand} />}
            </>
        )
    }

    const renderFile = (data) => {
        return (
            <>
                <div className={isSender ? "sender max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 mb-2 rounded-2xl text-sm" :
                 "receiver max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 mb-2 rounded-2xl text-sm"}>
                    <span>
                        <a href={data.message_data} target="_blank" download={data.preview} rel="noreferrer noopener" className="underline inline-flex items-center gap-2" >
                            <span>{data.preview}</span>
                            <span className="inline-flex p-1 bg-neutral-500 rounded-[50%]"><img src={DownloadBtn} alt="" /></span>
                        </a>
                    </span>
                </div>
            </>
        )
    }

    const renderAudio = (data) => {
        return (
            <AudioPlayer isSender={isSender} data={data}/>
        )
    }

    const renderLocation = (data) => {
        return (
            <div className={isSender ? "sender max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 rounded-2xl text-sm break-all" : "receiver max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 rounded-2xl text-sm break-all"}>
                <a href={`https://www.google.com/maps/@${data.message_data.lat},${data.message_data.lng},18z?hl=en`}>Location</a>
            </div>
        )
    }

    const renderVideo = (data) => {
        return (
            <div className={isSender ? "sender rounded-xl" : "receiver rounded-xl"} >
                <video width="320" height="240" className="rounded-xl" controls="controls">
                    <source src={data.message_data} type="video/mp4" />
                </video>
            </div>
        )
    }

    return ( 
        <>
            {data.message_type === "text" && renderText(data)}
            {data.message_type === "image" && renderImage(data)}
            {data.message_type === "file" && renderFile(data)}
            {data.message_type === "audio" && renderAudio(data)}
            {data.message_type === "location" && renderLocation(data)}
            {data.message_type === "video" && renderVideo(data)}
        </>
    );
}
 
export default ChatMessage;