import { useEffect, useRef, useState } from "react";
import PlayButton from "../assets/icons/audio.svg"
import PauseButton from "../assets/icons/pause.svg"
import moment from "moment";

const AudioPlayer = ({isSender, data}) => {
    const [duration, setDuration] = useState(0);
    const [percent, setPercent] = useState(0);
    const [time, setTime] = useState();
    const [status, setStatus] = useState('loading');
    const audioPlayer = useRef();

    let interval;

    const startTimer = (e) =>{
        interval = setInterval(()=>{
            let currentTime = e.target.currentTime;
            setPercent(Number(currentTime));
        },100);
    }

    const handleTimer = (type) => {
        if (type==="pause") {
            setStatus("pause");
            stopTimer();
        }
    }

    const stopTimer = () => {
        if(interval) {
            clearInterval(interval);
        }
    }

    const handleAudio = async (e) => {
        while(e.target.duration === Infinity) {
            await new Promise(r => setTimeout(r, 1000));
            e.target.currentTime = 10000000 * Math.random();
        }
        let time = e.target.duration;
        e.target.currentTime = 0;
        setDuration(time);
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

    const startDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick('pause');
    }

    const handleDrag = (e) => {
        audioPlayer.current.currentTime = Number(e.target.value);
        handleClick('play');
    }

    useEffect(()=>{
        const date = moment(data.createdAt * 1000).format("h:mm a");
        setTime(date);
    },[])

    function convertTime(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        let hours    = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02

        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds; // Return is MM : SS
    }

    return ( 
        <>
        <div className={isSender ? "sender flex w-[60%] h-[50px] bg-slate-200 rounded p-[3px] pr-[10px] shrink-0" 
            : "receiver flex w-[60%] h-[50px] bg-slate-200 rounded p-[3px] pr-[10px] shrink-0"}>
            <div className="flex flex-col justify-center h-full w-[100%]">
                <div className="flex h-full w-[100%] items-center">
                    {status === "playing" ? (
                        <img src={PauseButton} onClick={()=>handleClick('pause')}  />
                    ) : (
                        <img src={PlayButton} onClick={()=>handleClick('play')} />
                    )}
                    <input type="range" 
                    className="flex-grow" 
                    value={percent} 
                    onChange={handleDrag} 
                    onDragStart={startDrag} 
                    onDrag={startDrag}
                    draggable min={0} step={0.1} max={duration} 
                    />
                </div>
                <div className="flex items-center justify-between w-[90%] text-right ml-auto">
                    <span className="text-[10px]">{convertTime(percent)}</span>
                    <span className="text-[10px]">{time}</span>
                </div>
            </div>
            <audio  
                className="hidden" 
                preload="auto" 
                onLoadedData={handleAudio} 
                ref={audioPlayer} 
                onPlay={()=>setStatus("playing")} 
                onPause={()=>handleTimer("pause")} 
                onEnded={()=>handleTimer("pause")}
                onPlaying={startTimer}
            >
                <source src={data.message_data} />
            </audio>
        </div>
        </>
    );
}
 
export default AudioPlayer;