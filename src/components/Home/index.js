import {useEffect, useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import Cookies from 'js-cookie'
import { BiLike, BiSolidLike } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaRegComment } from "react-icons/fa";
import { DNA } from 'react-loader-spinner'
import Header from '../Header'


const Home = () => {
    const [listOfPosts, setListOfPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [showLoader, setLoader] = useState(true) 
    const history = useHistory()

    const getListOfPosts = async () => {
        const response = await axios.get('https://full-stack-blog-server-o6hn.onrender.com/posts', 
            {headers: {accessToken: Cookies.get('jwt_token')}})
        // console.log(response)

        setLoader(false)
        setListOfPosts(response.data.listOfPosts.reverse())
        setLikedPosts(response.data.likedPosts.map(item => item.PostId))
        
    }

  useEffect(() => {
    const token = Cookies.get('jwt_token')
    if (token !== undefined){
        getListOfPosts()
    }
  }, [])

  const onClickLikePost = async (postId) => {
    if (likedPosts.includes(postId)){
        setLikedPosts(likedPosts.filter(id => id !== postId))
    }else{
        setLikedPosts([...likedPosts, postId])
    }
    const response = await axios.post('https://full-stack-blog-server-o6hn.onrender.com/likes', {PostId: postId}, {
        headers: {
            accessToken: Cookies.get('jwt_token')
        }
    })

    // console.log(response)

    setListOfPosts(listOfPosts.map(post => {
        if (post.id === postId){
            if (response.data.isLiked){
                return {...post, Likes: [...post.Likes, 0]}
            }else{
                const likesArr = post.Likes
                likesArr.pop()
                return {...post, Likes: likesArr}
            }
        }else{
            return post
        }
    }))

  }

  const homeData = () => {
    return(
        listOfPosts.length > 0 ?    
            <ul className='posts-container'>
            {listOfPosts.map(eachPost => 
                <li key={eachPost.id} className='each-post'> 
                    <Link to={`profile-info/${eachPost.UserId}`} className='post-username'>
                        <CgProfile className='profile-icon'/> 
                        <p> {eachPost.username.slice(0, 1).toUpperCase() + eachPost.username.slice(1, )}</p>
                    </Link>
                    {eachPost.imgUrl !== null && <img src={eachPost.imgUrl} className='img'/>}
                    <p className='post-title'> {eachPost.title} </p>
                    <p onClick={() => {history.push(`/post/${eachPost.id}`)}}
                        className='post-text'> {eachPost.postText} </p>
                    
                    <div className='like-comments'>
                        <div className='like-containerr'>
                            {
                                likedPosts.includes(eachPost.id) ? 
                                    <button onClick={() => {onClickLikePost(eachPost.id)}}
                                        className='like-btn-solid'> <BiSolidLike/></button>
                                : 
                                    <button onClick={() => {onClickLikePost(eachPost.id)}}
                                        className='like-btn'> <BiLike/></button>
                            }
                            <label className='length' > {eachPost.Likes.length}</label>
                        </div>
                        <FaRegComment onClick={() => {history.push(`/post/${eachPost.id}`)}}
                            className='comments-icon'/>
                    </div>
                </li>)}
            
        </ul> : 
        <div className='empty-container'>
            <p className='empty-text'> There are no posts to show. </p>
        </div>
    )
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

  return (
        <>
            <Header/>
            <div className='home-container'>
                <div className='home-responsive-container'>
                    {showLoader ? loaderView(): homeData()}
                </div>
            </div>
        </>
    )
}

export default Home
