import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

interface UserDetails {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  photoPath: string | null;
  gender: string | null;
  phoneNumber: string | null;
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
    phoneNumber: null,
    role: null,
    lastActive: null
  }
};

const setAuthCookie = (token: string, name: string) => {
  const toBase64 = Buffer.from(token).toString('base64');

  setCookie(name, toBase64, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    // more security options here
    // sameSite: 'strict',
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  });
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
