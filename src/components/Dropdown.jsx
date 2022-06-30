import { addDoc,updateDoc, serverTimestamp } from "firebase/firestore";
import { messagesColRef } from "../firebase/firestore";

import PhotoIcon from "../assets/icons/photo.svg"
import DocumentIcon from "../assets/icons/document.svg";
import LocationIcon from "../assets/icons/location.svg";
import ContactIcon from "../assets/icons/contact.svg";



const Dropdown = ({handleDropDown, setFile, chatId, uid, chatRef}) => {

    const handleChange = async (e) => {
        try{
            const file = e.target.files[0];
            setFile(file);
            handleDropDown();
        }
        catch(err) {
            console.log(err);
        }
    }

    const handleLocation = async (e) => {

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendLocation);
        } 
        
        async function sendLocation(position) {
                try{
                    await addDoc(messagesColRef, {
                        chat_id: chatId,
                        sender: uid,
                        message_type: "location",
                        message_data: {
                            lat:position.coords.latitude,
                            lng:position.coords.longitude
                        },
                        createdAt: serverTimestamp(),
                    }) 
                    await updateDoc(chatRef, {
                        lastUpdatedAt: serverTimestamp(),
                        lastUpdatedType: "location",
                    })
                    setFile(null);
                } catch (err) {
                    console.log(err)
                }
        }
    }

    return ( 
        <div className="absolute z-20 top-0 left-0 w-[100%] h-[100%] bg-neutral-500/25" onClick={handleDropDown} > 
            <div className="flex flex-col w-[100%] absolute left-0 bottom-[65px]" onClick={e=>e.stopPropagation()}>
            {/* <span id="close" className="absolute top-2 right-10 cursor-pointer" onClick={handleDropDown}><img src={CloseIcon}/></span> */}
                <ul className="bg-white w-[90%] mx-auto p-2 rounded-3xl">
                    <li className="p-2 border-solid border-b-2 w-full">
                        <label htmlFor="photo" className="cursor-pointer w-full inline-flex gap-2">
                            <img src={PhotoIcon} />
                            <span>Photo & Video  Library</span>
                        </label>
                        <input type="file" id="photo" className="hidden" onChange={handleChange} accept="video/*,image/*" />
                    </li>
                    <li className="p-2 border-solid border-b-2">
                        <label htmlFor="document" className="cursor-pointer w-full inline-flex gap-2">
                            <img src={DocumentIcon}  />
                            <span>Document</span>
                        </label>
                        <input type="file" id="document" className="hidden" onChange={handleChange} />
                    </li>
                    <li className="p-2 border-solid border-b-2">
                        <label htmlFor="location" className="cursor-pointer w-full inline-flex gap-2" onClick={handleLocation}>
                            <img src={LocationIcon} />
                            <span>Location</span>
                        </label>
                    </li>
                    <li className="p-2 border-solid border-b-2">
                        <label htmlFor="contact" className="cursor-pointer w-full inline-flex gap-2">
                            <img src={ContactIcon} />
                            <span>Contact</span>
                        </label>
                    </li>
                    <li className="p-2 text-center cursor-pointer" onClick={handleDropDown}>Cancel</li>
                </ul>
            </div>
        </div>
    );
}
 
export default Dropdown;