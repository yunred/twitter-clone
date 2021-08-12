import React, { useState } from 'react';
import { dbService } from 'fbase';

const Cweet = ({ cweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); //editing 모드
  const [newCweet, setNewCweet] = useState(cweetObj.text); //기존 text, input에 입력된 text값 업데이트
  console.log(isOwner);

  //삭제
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this cweet?');
    if (ok) {
      await dbService.doc(`cweets/${cweetObj.id}`).delete();
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
          {/* owner만 접근가능 */}
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
