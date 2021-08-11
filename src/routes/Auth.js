import React, { useState } from 'react';
import { authService, firebaseInstance } from 'fbase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = event => {
    //한글자씩 추가
    const {
      //event.target.name/value
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async event => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //계정 생성
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        //로그인
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  //
  const toggleAccount = () => setNewAccount(prev => !prev);
  //소셜로그인
  const onSocialClick = async event => {
    const {
      target: { name },
    } = event; //event로 부터! event 안에 있는 target 안에 있는 value
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider(); //
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? 'Create Account' : 'Sign In'}
        />
        {error}
      </form>
      {/* 토글 식으로 누르면 바뀜 */}
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
