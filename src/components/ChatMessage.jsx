import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import DownloadBtn from "../assets/icons/download.svg";
import AudioPlayer from "./AudioPlayer";

const ChatMessage = ({data}) => {
    const { uid } = useSelector(state=>state.user.data.userData);

    const isSender = uid === data.sender ? true : false;

    const renderText = (data) => {
        return (
            <>
            {isSender ? (
                <div className="sender max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 rounded-2xl text-sm break-all" >{data.message_data}</div>
            ) : (
                <div className="receiver max-w-[90%] text-left p-[5px] px-[10px] bg-blue-200 rounded-2xl text-sm break-all">{data.message_data}</div>
            )}
            </>
        )
    }

    const renderImage = (data) => {
        return (
            <>
            {isSender ? (
                <div className="sender max-w-[90%] rounded-2xl relative">
                    <img src={data.message_data} className="w-full object-contain" />
                    {data.status && <div className="spinner"></div>}
                </div>
            ): (
                <div className="receiver max-w-[90%] rounded-2xl relative">
                    <img src={data.message_data} className="w-full object-contain" />
                    {data.status && <div className="spinner"></div>}
                </div>
            )}
            </>
        )
    }

    const renderFile = (data) => {
        return (
            <>
            {isSender ? (
                <div className="sender max-w-[90%] text-left p-[5px] px-[10px] bg-slate-200 mb-2 rounded-2xl text-sm">
                    <span>
                        <a href={data.message_data} target="_blank" download={data.preview} rel="noreferrer noopener" className="underline inline-flex items-center gap-2" >
                            <span>{data.preview}</span>
                            <span className="inline-flex p-1 bg-neutral-500 rounded-[50%]"><img src={DownloadBtn} alt="" /></span>
                        </a>
                    </span>
                </div>
            ) : (
                <div className="receiver max-w-[90%] text-left p-[5px] px-[10px] bg-blue-200 mb-2 rounded-2xl text-sm">
                    <span>
                        <a href={data.message_data} target="_blank" rel="noreferrer noopener" className="underline inline-flex items-center gap-2" >
                            <span>{data.preview}</span>
                            <span className="inline-flex p-1 bg-neutral-500 rounded-[50%]"><img src={DownloadBtn} alt="" /></span>
                        </a>
                    </span>
                </div>
            )}
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

    return ( 
        <>
            {data.message_type === "text" && renderText(data)}
            {data.message_type === "image" && renderImage(data)}
            {data.message_type === "file" && renderFile(data)}
            {data.message_type === "audio" && renderAudio(data)}
            {data.message_type === "location" && renderLocation(data)}
        </>
    );
}
 
export default ChatMessage;