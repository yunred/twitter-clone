import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';

const Cweet = ({ cweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); //editing 모드
  const [newCweet, setNewCweet] = useState(cweetObj.text); //기존 text, input에 입력된 text값 업데이트
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this cweet?');
    if (ok) {
      await dbService.doc(`cweets/${cweetObj.id}`).delete(); //document 삭제
      await storageService.refFromURL(cweetObj.attachmentUrl).delete(); //사진 삭제 attachmentUrl은 cweetObj에 있다
    }
  };

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async event => {
    event.preventDefault();
    await dbService.doc(`cweets/${cweetObj.id}`).update({
      text: newCweet, //newcweet은 input 안의 text
    });
    setEditing(false); //editing mode 취소
  };

  //수정하는거 실시간으로
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewCweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your cweet"
              value={newCweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Cweet" /> {/*value??*/}
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
          {cweetObj.attachmentUrl && (
            <img src={cweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {/* owner만 접근가능 */}
          <span>{isOwner}</span>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Cweet</button>
              <button onClick={toggleEditing}>Edit Cweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cweet;
