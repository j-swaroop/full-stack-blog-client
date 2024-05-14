import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {AuthContext} from './context/AuthContextt';

import { useState, useEffect } from 'react';
import Login from './components/Login'
import Registration from './components/Registration'
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import './App.css';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import axios from 'axios';
import Cookies from 'js-cookie';

const App = () => {
  const [authState, setAuthState] = useState({
    username: '',
    id: 0
  })

  useEffect(() => {
    axios.get('https://full-stack-blog-server-o6hn.onrender.com/auth/auth', {
      headers: {
        accessToken: Cookies.get('jwt_token')
      }
    }).then((response) => {
      if (!response.data.error){
        let name = response.data.username
        setAuthState({
          username: name,
          id: response.data.id
        })
      }
    })
  }, [])

  return(
    
    <BrowserRouter>
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Registration}/>
          <ProtectedRoute exact path='/' component={Home}/>
          <ProtectedRoute exact path='/profile-info/:id' component={Profile}/>
          <ProtectedRoute exact path='/createpost' component={CreatePost}/>
          <ProtectedRoute exact path='/post/:id' component={Post}/>
          <Route path='/not-found'component={NotFound}/>
          <Redirect to='/not-found'/>
        </Switch>
      </AuthContext.Provider>
    </BrowserRouter>
  ) 
}

export default App;
