import React, { useState, useEffect } from 'react';
import { dbService } from 'fbase';

const Home = () => {
  const [cweet, setCweet] = useState(''); //현재 트윗창
  const [cweets, setCweets] = useState([]); //모든 트윗

  const getCweets = async () => {
    const dbCweets = await dbService.collection('cweets').get(); //get은 QueryDocumentSnapshot을 return함
    dbCweets.forEach(document => {
      const cweetObject = {
        //cweetOject는 모든 document.data()를 가짐
        ...document.data(),
        id: document.id,
      };
      setCweets(prev => [cweetObject, ...prev]);
      //set함수를 쓸 때 값 대신 함수 전달 가능
      //함수를 전달하면, 리액트에선 이전 값에 접근할 수 있게 해줌
    });
  };
  //mount될 때 실행
  useEffect(() => {
    getCweets();
  }, []);

  //submit할 때 마다 document생성
  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection('cweets').add({
      cweet,
      createdAt: Date.now(),
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
          <div key={cweet.id}>
            <h4>{a.cweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
