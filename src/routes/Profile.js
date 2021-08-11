import React from 'react';
import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut(); //로그아웃
    history.push('/'); //back home
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
