import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const AuthContext = createContext({
  accessToken: null,
  logout: () => {},
});

const REFRESH_TOKEN_URL = process.env.NEXT_PUBLIC_REFRESH_TOKEN_URL;
const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL;

const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState(() =>
    getCookie('accessToken')
  );

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.get(`${process.env.REFRESH_TOKEN_URL}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const newAccessToken = response.data.access_token;
        setCookie('accessToken', newAccessToken);
        setAccessToken(newAccessToken);
      } catch (error) {
        console.error('Error refreshing access token:', error);
        handleLogout();
      }
    };

    if (accessToken) {
      const refreshTokenInterval = setInterval(refreshAccessToken, 60000); // Refresh every minute

      return () => clearInterval(refreshTokenInterval);
    }
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      await axios.get(`${LOGOUT_URL}`);
      deleteCookie('accessToken');
      setAccessToken('');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken: null, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
