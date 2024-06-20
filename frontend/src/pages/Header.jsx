import React from 'react'
import { useContext, useEffect } from 'react';
import {UserContext} from "../usercontext"
import { Link } from 'react-router-dom';

export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('https://reactgirlysocialnetwork-backend-dzs8.onrender.com/profile', {
            credentials: "include",
        }).then(response => {
             response.json().then(userInfo => {
            setUserInfo(userInfo);
             })
        })
    }, []);

    function logout() {
        fetch('https://reactgirlysocialnetwork-backend-dzs8.onrender.com/logout', {
            credentials: "include",
            method: 'POST',
        })
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
      <div>
      {username && (
          <>
          <Link to={`/userProfile/${userInfo.username}`}>
          {userInfo.username}
          </Link>
          
          <Link to="/create">
            Post some shit
            </Link>
          <p onClick={logout}>Logout</p>
          </>
      )}
      {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )
      }
  </div>
  )};