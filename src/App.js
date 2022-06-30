import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/auth";
import { loginUser, logoutUser } from "./store/reducers/userReducer";
import AuthRoute from "./components/AuthRoute";

import Messages from "./pages/Messages";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    onAuthStateChanged(auth, user=>{
        if(user) dispatch(loginUser({uid: user.uid}))
        else dispatch(logoutUser())
    })
},[])


  return (
    <div className="App max-w-[480px] m-auto relative h-[100vh] border-solid border-black border-x-2 overflow-hidden">
      <Routes>  
        <Route element={<ProtectedRoute />} >
          <Route path="chat/:id" element={<ChatPage />} />
          <Route path="/" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AuthRoute />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
