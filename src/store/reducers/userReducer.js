import { createSlice } from '@reduxjs/toolkit'

const uid = localStorage.getItem("uid");

const initialState = uid ? {
  data:{
    isAuthenticated: true, 
    userData:{
      uid: uid
    }
  }
} : {
  data:{
    isAuthenticated: false, 
    userData:{}
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      localStorage.setItem("uid", action.payload.uid);
      state.data = {userData: action.payload, isAuthenticated: true }
    },
    logoutUser: (state) => {
      localStorage.removeItem("uid");
      state.data = {
        isAuthenticated: false, 
        userData:{}
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer