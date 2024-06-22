import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import { DNA } from 'react-loader-spinner'
import './index.css'
import { useState } from 'react'


const CreatePost = () => {
    let history = useHistory()
    const [imgObj, setimage] = useState(null)
    const [showLoader, setLoader] = useState(false) 
   
    const initialValues = {
        title: '',
        postText: '',
    }

   

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        postText: Yup.string().required(),
    })

    const onSubmitPost = async data => {
        // console.log(imgObj)
        setLoader(true)
        if (imgObj !== null){
            const formData = new FormData()
            formData.append('file', imgObj)
            formData.append('upload_preset', 'y5mse0eo')
            const responseForUrl = await axios.post('https://api.cloudinary.com/v1_1/drnrrd97f/image/upload', formData)
            data.imgUrl = responseForUrl.data.url
        }
        
        const response = await axios.post('https://full-stack-blog-server-production-0fdb.up.railway.app/posts', data, {
            headers: {
                accessToken: Cookies.get('jwt_token')
            }
        })

        // console.log(response.data)
        history.push('/')
        
    }

    const demo = async event => {
        // setimage(event)
        let file = event.target.files[0]
        setimage(file)
        
    }

    const loaderView = () => {
        return(
            <div className='loader-container'>
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </div>
        )
      }

    return(
        <>
            <Header/>
            {showLoader ? loaderView()
            :
                (<div className='create-postt-container'> 
                    <div className='create-postt-responsive-container'>
                    <Formik initialValues={initialValues} onSubmit={onSubmitPost} className='create-post-form' 
                        validationSchema={validationSchema}>
                        <Form className='create-input'>
                            <div className='form-custom-field'>
                                <label htmlFor='inputCreatePost' className='label'> Title </label>
                                <Field id='inputCreatePost' name='title' className='input-custom'
                                    placeholder='Enter Your Title' />
                                <ErrorMessage name='title' component='span' className='error'/>
                            </div>
                            <div className='form-custom-field'>
                                <label htmlFor='inputCreatePost' className='label'> Post </label>
                                <Field id='inputCreatePost' name='postText' 
                                    placeholder='Your Post Text' className='input-custom'/>
                                <ErrorMessage name='postText' component='span' className='error'/>
                            </div>
                            <div className='form-custom-field'>
                                <label htmlFor='imgUrl' className='label file'>Image Optional </label>
                                <input id='imgUrl' type='file' onChange={demo} />
                            </div>
                            <button type='submit' className='login-btn input-custom'> Create Post</button>
                        </Form>
                    </Formik>
                    </div>
                </div>)
            }
        </>
    )
}


export default CreatePost
