'use client';
import { Skeleton } from 'antd';
import LoginAdmin from './Login';
import LogoutButton from './LogoutButton';
import useUser from 'apps/admin/store/useUser';

const Profile = () => {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? (
    <div className="flex flex-col justify-center text-center place-items-center ">
      <LogoutButton />
    </div>
  ) : (
    <LoginAdmin />
  );
};

export default Profile;
