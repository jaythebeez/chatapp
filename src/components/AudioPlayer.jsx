import { useEffect, useRef, useState } from "react";
import PlayButton from "../assets/icons/audio.svg"
import PauseButton from "../assets/icons/pause.svg"
import moment from "moment";

const AudioPlayer = ({isSender, data}) => {
    const [audioLength, setAudioLength] = useState(0);
    const [time, setTime] = useState();
    const [status, setStatus] = useState('loading');
    const audioPlayer = useRef();

    const handleAudio = (e) => {
        setStatus('loaded');
    }

    const handleClick = (action) => {
        if(action === "play"){
            const audios = document.querySelectorAll('audio');
            audios.forEach((audio)=>{
                audio.pause();
            })
            audioPlayer.current.play();
        }
        if(action === "pause") audioPlayer.current.pause();
    }

    useEffect(()=>{
        console.log(data)
        const date = moment(data.createdAt * 1000).format("h:mm a");
        setTime(date);
    },[])

    return ( 
        <>
        <div className="sender flex w-[75%] h-[50px] bg-slate-200 rounded p-[3px] pr-[10px] shrink-0">
            <div className="sender flex flex-col justify-center h-full w-[100%]">
                <div className="flex h-full w-[100%] items-center ">
                    {status === "playing" ? (
                        <img src={PauseButton} onClick={()=>handleClick('pause')}  />
                    ) : (
                        <img src={PlayButton} onClick={()=>handleClick('play')} />
                    )}
                    <div className="flex-grow h-[2px] bg-gray-600"></div>
                </div>
                <div className="flex items-center justify-between w-[90%] text-right ml-auto">
                    <span className="text-[10px]">00:00</span>
                    <span className="text-[10px]">{time}</span>
                </div>
            </div>
            <audio  
                className="sender hidden" 
                preload="auto" 
                onLoadedData={handleAudio} 
                ref={audioPlayer} 
                onPlay={()=>setStatus("playing")} 
                onPause={()=>setStatus("paused")} 
                onEnded={()=>setStatus("ended")}
            >
                <source src={data.message_data} />
            </audio>
        </div>
        </>
    );
}
 
export default AudioPlayer;