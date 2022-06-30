import AudioIcon from '../assets/icons/audio.svg';
import ImageIcon from "../assets/icons/camera.svg";
import DownloadIcon from "../assets/icons/download.svg";
import VideoIcon from "../assets/icons/video.svg";

const MessageTag = ({type, preview}) => {
    console.log(type);

    const shortenText = (text) => {
        if (text.length > 50) {
            return `${text.substr(0, 50)}...`
        }
        if (text.length)
            return text
        else return "";
    }

    return ( 
        <>
        {type === "text" && (
            <div>
                <span className="inline-flex text-xs">
                    {shortenText(preview)}
                </span>
            </div>
        )}
        {type === "image" && (
            <div>
                <span className="inline-flex text-xs items-center bg-slate-200 px-[5px] py-[2px] rounded-md">
                    <img className='w-[20px] h-[20px]' src={ImageIcon}/><span>Image</span>
                </span>
            </div>
        )}
        {type === "video" && (
            <div>
                <span className="inline-flex text-xs items-center bg-slate-200 px-[5px] py-[2px] rounded-md">
                    <img className='w-[20px] h-[20px]' src={VideoIcon}/><span>Video</span>
                </span>
            </div>
        )}
        {type === "audio" && (
            <div>
                <span className="inline-flex text-xs items-center bg-slate-200 px-[5px] py-[2px] rounded-md">
                    <img className='w-[20px] h-[20px]' src={AudioIcon}/><span>Audio</span>
                </span>
            </div>
        )}

        {type === "file" && (
            <div>
                <span className="inline-flex text-xs items-center bg-slate-200 px-[5px] py-[2px] rounded-md">
                    <img className='w-[20px] h-[20px]' src={DownloadIcon}/><span>File</span>
                </span>
            </div>
        )}
        </>
    );
}
 
export default MessageTag;