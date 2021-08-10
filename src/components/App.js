import AppRouter from 'components/Router';
import React, { useState, useEffect } from 'react';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    //onAuthStateChanged는 user의 로그인 상태 변화를 체크함 + firebase가 실행될 때도 / (user)을 callback
    authService.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []); // 처음만 실행
  return (
    <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}</> //initialize되었으면 router 보여줌
  );
}

export default App;
