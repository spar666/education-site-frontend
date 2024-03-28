import { createSlice } from "@reduxjs/toolkit";



type User = {
  accessToken: string | null;
  details: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    photoPath: string | null;
    gender:string | null;
    phoneNumber:string | null;
    role: string | null;
    lastActive:string | null;
      
    
  };
};

const initialState: User = {
  accessToken: null,
  details: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    photoPath: null,
    gender:null,
    phoneNumber:null,
    role:null,
    lastActive:null
  },
};



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateAccessToken(state, { payload }) {
      console.log(payload, "from cces")
      state.accessToken = payload;
    },
    updateUserDetails(state, { payload }) {
      console.log(payload, "from login page")
      state.details = payload;
    },
  },
});



export const { updateUserDetails, updateAccessToken } = userSlice.actions;

export const selectUserDetails = ({ user }:any) => ({
  user: user.details,
  isAuthenticated: !!user.details.id,
});

export const selectAcessToken = ({ user }:any) => user.accessToken;

export default userSlice.reducer;
