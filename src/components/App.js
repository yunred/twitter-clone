import AppRouter from 'components/Router';
import React, { useState, useEffect } from 'react';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null); //user 저장해두기

  useEffect(() => {
    //onAuthStateChanged는 user의 로그인 상태 변화를 체크함 + firebase가 실행될 때도 / (user)을 callback
    authService.onAuthStateChanged(user => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []); // 처음만 실행
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        'Initializing...'
      )}
    </> //initialize되었으면 router 보여줌
  );
}

export default App;
