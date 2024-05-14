import {useState, useContext} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import { AuthContext } from '../../context/AuthContextt'
import './index.css'

const Login = () => {
    let history = useHistory()
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorObj, setErrorObj] = useState({
        errorMsg: '',
        isError: false
    })
    const [passwordType, setPasswordType] = useState({
        type: "password",
        checked: false
    })

    const {authState, setAuthState} = useContext(AuthContext)

    const onClickLogin = async () => {
        const userObj = {username: username, password: password}
        const response = await axios.post('https://full-stack-blog-server-o6hn.onrender.com/auth/login', userObj)
        
        if (!response.data.error){
            const {jwtToken, username, id} = response.data
            
            setAuthState({...authState, username: username, id: id})

            // console.log(response.data)
            Cookies.set('jwt_token', jwtToken, {expires: 30})
            history.replace('/')
        }else{
            setErrorObj({errorMsg: response.data.error, isError: true})
        }

        setUsername('')
        setPassword('')
    }

    const onChangeUsername = event => {
        setUsername(event.target.value)
    }

    const onChangePassword = event => {
        setPassword(event.target.value)
    }

    const onClickRegister = () => {
        history.push('/register')
    }

    const onChangeCheckBox = () => {
        const type = passwordType.checked
        if (type){
            setPasswordType({...passwordType, type: 'password', checked: !passwordType.checked})
        }else{
            setPasswordType({...passwordType, type: 'text', checked: !passwordType.checked})
        }
    }

    return(
        <div className='login-container'> 
            <div className='login-responsive-container'>
                <div className='form-container'>
                    <h1 className='title'> WELCOME BACK</h1>
                    <p className='subtext'>Welcome back! please enter your details.</p>

                    <div className='form-field'>
                        <label className='label' htmlFor='UserName'>Username</label>
                        <input type='text' placeholder='Enter your username' id='UserName'
                            value={username} onChange={onChangeUsername} className='input'/>
                    </div>

                    <div className='form-field'>
                        <label className='label' htmlFor='Password'>Password</label>
                        <input type={passwordType.type} placeholder='*************' id='Password'
                            value={password} onChange={onChangePassword} className='input'/>
                    </div>
                    <div className='checkbox-field'>
                        <label className='label' htmlFor='checkbox'>Show password</label>
                        <input type='checkbox' id='checkbox' onClick={onChangeCheckBox}
                            className='checkbox' value={passwordType.checked}/>
                    </div>
                    
                    <button onClick={onClickLogin} className='login-btn'> Login </button>
                    {errorObj.isError && <p className='error'> *{errorObj.errorMsg} </p>}
                    <p className='sign-up-btn'>Don’t have an account? 
                        <span className='sign-up-text' onClick={onClickRegister}> Sign up </span> for free!</p>
                </div>
                <div className='login-img-container'>
                    <img src='https://res.cloudinary.com/drnrrd97f/image/upload/v1715086559/Right_Side_2x_1_kxe7p8.png' 
                        alt='' className='login-img'/>
                </div>
            </div>
        </div>
    )
}


export default Login
