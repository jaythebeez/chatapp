import { query, where, getDocs, addDoc, Timestamp, getDoc, serverTimestamp, doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatColRef } from "../firebase/firestore";

const NewChatMenu = ({setOpenMenu, uid}) => {
    const navigate = useNavigate();
    const [queryValue, setQuery] = useState("");
    const [userId,setUserId ] = useState("");

    const checkIfChatExists = () => {
        return new Promise(async (resolve, reject)=>{
            try{
                const chatQuery = query(chatColRef,
                where("users", "array-contains", userId), 
                where("query_id", "==", queryValue));
                let chats = [];
                const querySnapshot = await getDocs(chatQuery);

                querySnapshot.forEach((doc) => {
                    chats.push({docId: doc.id, ...doc.data()});
                });
        
                if (chats.length) {
                    for (let chat of chats) {
                        if(chat.users.includes(uid)){
                            let id = chat.docId;
                            console.log("navigating");
                            // navigate(`/chat/${id}`);
                            resolve(true);
                        }
                    }
                }
                resolve(false);
            } catch (err) {
                reject(err);
            }
        })
    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            const docExists = await checkIfChatExists();
            console.log(docExists);
            if(!docExists) {
                const docRef = await addDoc(chatColRef, {
                    users: [uid, userId],
                    query_id: queryValue,
                    createdAt: serverTimestamp(),
                    lastUpdatedAt: serverTimestamp(),
                })
                navigate(`/chat/${docRef.id}`)
            }
            setOpenMenu(false);
        }
        catch(err) {
            console.log(err);
        }
    }
    return ( 
        <form onSubmit={handleSubmit}>
            <div className="absolute top-[3.75rem] right-7 w-[75%] bg-white flex flex-col border-solid border-2 border-red p-2 rounded-md">
                <input type="text" className="form_input " placeholder="Query Id" value={queryValue} onChange={e=>setQuery(e.target.value)} required/>
                <input type="text" className="form_input " placeholder="User Id" value={userId} onChange={e=>setUserId(e.target.value)} required/>
                <button className="text-white px-3 py-2 bg-blue-500">Enter Chat</button>
            </div>
        </form>     
    );
}
 
export default NewChatMenu;