import { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import {v4} from 'uuid'
import Cookies from 'js-cookie'
import Header from '../Header'
import { AuthContext } from '../../context/AuthContextt'
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import './index.css'
import Popup from 'reactjs-popup';
import { useContext } from 'react'
import { MdDeleteOutline } from "react-icons/md";


const Post = () => {
    let {id} = useParams()
    let history = useHistory()

    const [postObj, setPostObj] = useState({}) // for add new post
    const [comments, setComments] = useState([]) // for geting all comments
    const [newComment, setNewComment] = useState('') // for posting comment
    const {authState} = useContext(AuthContext)

    const getPost = () => axios.get(`https://full-stack-blog-server-o6hn.onrender.com/posts/byId/${id}`).then((response) => {
        setPostObj(response.data)
    })

    const getComments = () => axios.get(`https://full-stack-blog-server-o6hn.onrender.com/comments/${id}`).then((response) => {
        const updatedData = response.data.map(eachComment => ({
            id: v4(),
            originalId: eachComment.id,
            commentBody: eachComment.commentBody,
            createdAt: eachComment.createdAt,
            updatedAt: eachComment.updatedAt,
            PostId: eachComment.PostId,
            username: eachComment.username
        }))

        setComments(updatedData)
    })

    useEffect(() => {
        getPost()
        getComments()
    }, [])


    const onAddComment = () => {
        if (newComment !== ''){
            axios.post(`https://full-stack-blog-server-o6hn.onrender.com/comments/`, {
                commentBody: newComment, 
                PostId: id 
            },
            {
                headers: {
                    accessToken: Cookies.get('jwt_token')
                }
            }
            
            ).then((response) => {
                if (response.data.error){
                    console.log(response.data.error)
                }else{
                    // console.log('Done')
                    getComments()
                    setNewComment('')
                }
            })
        }
        
    }

    const onChangeComment = event => {
        setNewComment(event.target.value)
    }

    const onClickDeleteComment = async (id) => {

        const response = await axios.delete(`https://full-stack-blog-server-o6hn.onrender.com/comments/${id}`, {
            headers: {
                accessToken: Cookies.get('jwt_token')
            }
        })

        // console.log(response)
        const newCommentsList = comments.filter(item => item.originalId !== id)
        setComments(newCommentsList)
    }

    const onClickDeletePost = async postId => {
        history.push('/')
        const response = await axios.delete(`https://full-stack-blog-server-o6hn.onrender.com/posts/${postId}`, {
            headers: {
                accessToken: Cookies.get('jwt_token')
            }
        })
        
    }
 
    const onEditPostTitle = async (title) => {
        let newTitle = prompt('Enter New Title: ', title);
        
        if (newTitle === null){
            return
        }else{
            await axios.put(`https://full-stack-blog-server-o6hn.onrender.com/posts/title`, {newTitle: newTitle, id: id}, {
                headers: {
                    accessToken: Cookies.get('jwt_token')
                }
            })
            setPostObj({...postObj, title: newTitle})
        }

        
    }

    const onEditPostText = async (text) => {
        let newText = prompt('Enter New Text: ', text)
        if (newText !== null){
            await axios.put(`https://full-stack-blog-server-o6hn.onrender.com/posts/postText`, {newText: newText, id: id}, {
                headers: {
                    accessToken: Cookies.get('jwt_token')
                }
            })
            setPostObj({...postObj, postText: newText})
        }

        
    }

    return (
        <>
            <Header/>
            <div className='post-obj-container'>
                <div className='home-responsive-container'>
                    <div className='each-post custom'>
                        <Link to={`/profile-info/${postObj.UserId}`} className='post-username'>
                            <CgProfile className='profile-icon'/>
                            <p> {postObj.username} </p>
                        </Link>
                        {postObj.imgUrl !== null && <img src={postObj.imgUrl} className='img'
                            alt=''/>}
                        <div className='title-container custom-2'>
                            <p className='post-title'> {postObj.title} </p>
                            {authState.username === postObj.username && 
                            <div className='edit-container' onClick={() => {onEditPostTitle(postObj.title)}}>
                                <span className='span'>Edit</span>
                                <button 
                                    className='edit'> <CiEdit/></button>
                            </div>}
                            
                        </div>
                        <p className='post-text custom-2'> {postObj.postText} 
                        {authState.username === postObj.username && 
                            <button onClick={() => {onEditPostText(postObj.postText)}}
                            className='text-edit'> <CiEdit/></button>}
                        </p>
                        
                        {postObj.username === authState.username &&
                            <Popup
                                trigger={<button className="login-btn"> Delete </button>}
                                modal
                                nested
                            >
                                {close => (
                                    <div className="modal">
                                        <button className="close" onClick={close}>
                                        &times;
                                        </button>
                                        <div className="content">
                                            Are you sure you want to delete?
                                        </div>
                                        <div className="actions">
                                        
                                        <button className="yes-btn" 
                                            onClick={() => {onClickDeletePost(postObj.id)}}> Yes </button>
                                        <button
                                            className="yes-btn"
                                            onClick={() => {
                                            console.log('modal closed');
                                            close();
                                            }}
                                        >
                                            No
                                        </button>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                            
                            }
                    </div>
                    <div className='each-post comments-container'>
                        <p className='comments-title'> Comments</p>
                        
                        <input type='text' placeholder='Write a Comment' className='comment-input'
                            onChange={onChangeComment} value={newComment} />
                        <button onClick={onAddComment}
                            className='add-commment-btn'> Add Comment</button>
                        <ul className='comments-list'>
                            {comments.map(eachComment => 
                                <li key={eachComment.id} className='comments-item'> 
                                    <div className='comment-name'>
                                        <p className='commented-user'> {eachComment.username}</p>
                                        <button className='delet-com-btn'
                                            onClick={() => {onClickDeleteComment(eachComment.originalId)}}> 
                                            <MdDeleteOutline/>    
                                        </button>
                                    </div>
                                    <p className='comment-title'> {eachComment.commentBody} </p>
                                    
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                
               

            </div>
        </>
    )
}

export default Post
