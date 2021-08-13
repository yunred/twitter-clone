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
        setUserObj({
          //user의 일부분만 가져온다
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: args => user.updateProfile(args),
        });
      }
      setInit(true);
    });
  }, []); // 처음만 실행

  //navigation은  firebase와 연결되어 있지 않음. navigation은 userObj에 연결
  //따라서 firebase 정보로 react.js 업데이트해야함
  //새로고침
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: args => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
    </> //initialize되었으면 router 보여줌
  );
}

export default App;
