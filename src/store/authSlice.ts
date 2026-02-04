import { createSlice,  } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';


interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  permissions: string[];
}

interface AuthState {
  user: LoggedInUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get('token') || null,
  isAuthenticated: !!Cookies.get('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: LoggedInUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
     
      Cookies.set('token', token, { expires: 7 }); 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;