import React, { useState, useEffect } from 'react';
import { dbService } from 'fbase';
import Cweet from 'components/Cweet';
const Home = ({ userObj }) => {
  const [cweet, setCweet] = useState(''); //현재 트윗창
  const [cweets, setCweets] = useState([]); //모든 트윗

  //mount될 때 실행
  useEffect(() => {
    dbService.collection('cweets').onSnapshot(snapshot => {
      const cweetArray = snapshot.docs.map(doc => ({
        id: doc.id, //doc들은 id를 가지고있다??
        ...doc.data(),
      }));
      setCweets(cweetArray);
    });
  }, []);

  //submit할 때 마다 document생성
  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection('cweets').add({
      text: cweet,
      createdAt: Date.now(),
      createId: userObj.uid, //user정보를 추가
    });
    setCweet(''); //form 비우기
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setCweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={cweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Cweet" />
      </form>
      <div>
        {cweets.map(a => (
          <Cweet
            key={a.id} //key 필수
            cweetObj={a}
            isOwner={a.creatorId === userObj.uid} //cweet만든사람과 현재접속한사람 id비교
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
