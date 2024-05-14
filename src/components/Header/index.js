import { Link, withRouter, useHistory, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextt";
import { RiMenu3Line } from "react-icons/ri";
import { useState } from "react";
import { MdHome } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import './index.css'


const Header = () => {
    let history = useHistory()
    let {authState} = useContext(AuthContext)
    let {id} = authState

    const [showMenu, setShowMenu] = useState(false)
    // console.log(id)

    const onClickLogout = () => {
        Cookies.remove('jwt_token')

        history.replace('/login')
    }

    const onClickMenu = () => {
        setShowMenu(!showMenu)
    }

    const onClickHome = () => {
        history.push('/')
    }

    return (
        <>
        <div className="header">
            <div className="header-responsive">
                <div className="logo-container" onClick={onClickHome}>
                    <p className="name"> Socio<span className="blog-text">Blog</span> </p> 
                </div>
                <ul className="nav-list"> 
                    <Link to='/' className="nav-link">
                        <li className="nav-item"> 
                            <MdHome className="icon"/>
                            Home 
                        </li>
                    </Link>
                    <Link to='/createpost' className="nav-link">
                        <li className="nav-item"> 
                            <IoCreate className="icon"/>
                            CreatePost
                        </li>
                    </Link>
                    
                </ul>
                <div className="logout-container">
                    
                    <Link to={`/profile-info/${id}`} className="nav-link-p">
                        <CgProfile className="icon"/>
                        {authState.username} 
                     </Link>
                    
                    <button onClick={onClickLogout} className="logout"> Logout</button>
                </div>
            </div>


            <div className="header-mobile-container">
        <div className="header-mobile-responsive">
            <p className="name" onClick={onClickHome}> Socio<span className="blog-text">Blog</span> </p>
            <RiMenu3Line className="menu" onClick={onClickMenu}/> 
        </div>
        {showMenu && 
            <div className="mobile-menu">
                <ul className="nav-mobile-list"> 
                    <li className="nav-mobile-item"> 
                        <MdHome className="icon"/>
                        <Link to='/' className="nav-link"> Home </Link>
                    </li>
                    <li className="nav-mobile-item"> 
                        <IoCreate className="icon"/>
                        <Link to='/createpost' className="nav-link"> CreatePost</Link>
                    </li>
                    <li className="nav-mobile-item">
                        <CgProfile className="icon"/>
                        <Link to={`/profile-info/${id}`} className="nav-link"> 
                            {authState.username} </Link>
                    </li>
                    <li className="nav-mobile-item">
                        <IoLogOut className="icon"/>
                        <button onClick={onClickLogout} className="logout-mobile"> Logout</button>
                    </li>
                </ul>
            </div>}
        </div>
        </div>


        </>
    )
}

export default withRouter(Header)