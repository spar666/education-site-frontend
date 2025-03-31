import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

interface UserDetails {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  photoPath: string | null;
  gender: string | null;
  phone: string | null;
  studyLevel: string | null;
  destination: string | null;
  course: string | null;
  role: string | null;
  lastActive: string | null;
}

interface UserState {
  accessToken: string | null;
  details: UserDetails;
}

const initialState: UserState = {
  accessToken: null,
  details: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    photoPath: null,
    gender: null,
    phone: null,
    studyLevel: null,
    destination: null,
    course: null,
    role: null,
    lastActive: null
  }
};



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateAccessToken(state, action: PayloadAction<string | null>) {
      console.log(action.payload, "from cces")
      state.accessToken = action.payload;
    },
    updateUserDetails(state, action: PayloadAction<UserDetails>) {
      console.log(action.payload, "from login page")
      state.details = action.payload;
    },
  },
});

export const { updateUserDetails, updateAccessToken } = userSlice.actions;

export const selectUserDetails = ({ user }: { user: UserState }) => ({
  user: user.details,
  isAuthenticated: !!user.details.id,
});

export const selectAcessToken = ({ user }: { user: UserState }) => user.accessToken;

export default userSlice.reducer;