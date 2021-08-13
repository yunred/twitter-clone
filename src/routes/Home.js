import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fbase';
import Cweet from 'components/Cweet';
const Home = ({ userObj }) => {
  const [cweet, setCweet] = useState(''); //현재 트윗창
  const [cweets, setCweets] = useState([]); //모든 트윗
  const [attachment, setAttachment] = useState(''); //사진파일 주소

  //mount될 때 실행
  useEffect(() => {
    dbService.collection('cweets').onSnapshot(snapshot => {
      const cweetArray = snapshot.docs.map(doc => ({
        id: doc.id, //doc들은 id를 가지고있다
        ...doc.data(),
      }));
      setCweets(cweetArray);
    });
  }, []);

  //submit할 때 마다 document생성
  const onSubmit = async event => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
    }
    const cweetObj = {
      text: cweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, //user정보를 추가
      attachmentUrl,
    };
    await dbService.collection('cweets').add(cweetObj);
    setCweet('');
    setAttachment('');
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setCweet(value);
  };
  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0]; //하나의 파일
    //fileReader API : 파일 이름을 읽음
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      //reader에 eventlistener추가. 다읽으면 finishedEvent를 가지게 됨
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
      //onloadend에 finishedEvent의 result를 setAttachment로 설정
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment('');

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Cweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
