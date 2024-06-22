import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { useState } from 'react'
import './index.css'


const Registration = () => {
    let history = useHistory()
    const initialValues = {
        username: '',
        password: ''
    }
    const [msgObj, setMsgObj] = useState({
        msg: '',
        isDone: false
    })

    const [informText, setInformText] = useState({
        istrue: false,
        infromMsg: 'Please Wait...'
    })

    const validationSchema = Yup.object({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(3).max(20).required()
    })

    const onSubmitRegister = (data) => {
       setInformText({...informText, istrue: true})
       axios.post('https://full-stack-blog-server-production-0fdb.up.railway.app/auth', data).then((response) => {
            setMsgObj({msg: response.data.msg, isDone: true})
            setInformText({...informText, istrue: false})
       })

      

    }

    const onClickSignIn = () => {
        history.push('/login')
    }

    return(
        <div className='create-post-containerr'> 
            <div className='create-post-responsive-container'>
                <div className='login-img-container'>
                    <img src='https://res.cloudinary.com/drnrrd97f/image/upload/v1715093361/637b33b4e157a080b5a3e780_LbHEbC61IPGMp1gae1BlecTn8U089jqE7nuJFa3N19DbM9vlhbcv4k0-gPn9VERy4wRzEmY4S9ymCHkZ3bwXaQWe002KnwwqY0gOx5z_ETqVY_FsOw0bAoziTRhIvK9TgndFSr5Ck4z5Y8XXIUmwWXGAW_uKOrajHuzkM-YpErt2exuSLTJ_d5pmwy.jpg' 
                        alt='' className='register-img'/>
                </div>
                <div className='form-container'>
                    <h1 className='title registertext'> REGISTER USER</h1>
                    <p className='subtext registertext'>Welcome back! please register your details.</p>
                    <Formik initialValues={initialValues} onSubmit={onSubmitRegister} 
                        validationSchema={validationSchema}>
                        <Form className='formik-container'>
                            <div className='form-field'>
                                <label htmlFor='inputCreatePost' className='label'> Username </label>
                                <Field id='inputCreatePost' name='username' placeholder='Enter Username'
                                    className='input'/>
                                <ErrorMessage name='username' component='span' className='error'/>
                            </div>
                            
                            <div className='form-field'>
                                <label htmlFor='inputCreatePost' className='label'> Password </label>
                                <Field id='inputCreatePost' name='password' placeholder='Enter Password'
                                    className='input' />
                                <ErrorMessage name='password' component='span' className='error'/>
                            </div>

                            <button type='submit' className='login-btn'> Register </button>
                            {msgObj.isDone && <p className='error'> *{msgObj.msg} </p>}
                            {informText.istrue && <p className='error'> {informText.infromMsg} </p>}
                            <p className='sign-up-btn'>Already have an account? 
                            <span className='sign-up-text' onClick={onClickSignIn}> Sign In</span> for free!</p>
                            
                        </Form>
                    </Formik>
                </div>
                

            </div>
        </div>
    )
}


export default Registration