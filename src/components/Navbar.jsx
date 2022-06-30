import { NavLink } from "react-router-dom";
import MessageIcon from "../assets/icons/MessageIcon";

import HomeIcon from '../assets/icons/home.svg';
import ProfileIcon from "../assets/icons/ProfileIcon";
// import MessageIcon from "../assets/icons/message.svg";
import HeartIcon from "../assets/icons/heart.svg"
// import PersonIcon from "../assets/icons/person.svg";
import StoreIcon from "../assets/icons/store.svg";


const Navbar = () => {
    return ( 
        <div className="container absolute bottom-0 left-0 h-[65px] border-t-2 border-solid z-10 bg-white">
            <div className="flex w-[90%] m-auto justify-between items-center h-[100%]">
                <span className="nav-link" >
                    <span className=""><img src={HomeIcon} alt="" className="w-[24px] h-[24px]" /></span>
                    <span className="nav-link-text">Home</span>
                </span>
                <span className="nav-link" >
                    <span><img src={HeartIcon} alt="" className="w-[24px] h-[24px]" /></span>
                    <span className="nav-link-text">Favorites</span>
                </span>
                <NavLink to={'/'} className="nav-link" >
                    <span><MessageIcon /> </span>
                    <span className="nav-link-text">Messages</span>
                </NavLink>
                <span className="nav-link" >
                    <span><img src={StoreIcon} alt="" className="w-[24px] h-[24px]" /></span>
                    <span className="nav-link-text">My Business</span>
                </span>
                <NavLink to={'/profile'} className="nav-link" >
                    <span> <ProfileIcon /> </span>
                    <span className="nav-link-text">Profile</span>
                </NavLink>
            </div>
        </div>
    );
}
 
export default Navbar;