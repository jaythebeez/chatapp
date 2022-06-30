import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {  logout  } from "../firebase/auth";

const handleLogout = async () => {
    try{
        await logout();
    } catch (err) {
        console.log(err)
    }
}

const Profile = () => {
    const { uid } = useSelector(state=>state.user.data.userData)
    return ( 
        <div>
            <h1>User ID:</h1>
            <span>{uid}</span>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white block rounded-md">Logout</button>
            <Navbar />
        </div>
    );
}
 
export default Profile;