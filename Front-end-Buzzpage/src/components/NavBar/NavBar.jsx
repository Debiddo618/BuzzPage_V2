import Logo from '../../assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import styles from "./NavBar.module.css"
import { useState, useContext, useEffect } from 'react'
import { AuthedUserContext } from '../../App';
import NewsSlider from '../NewsSlider/NewsSlider';
import { show } from '../../services/profileService';




const NavBar = (props) => {
    const user = useContext(AuthedUserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleClick = (e) => {
        navigate(`/users/${user._id}/posts/new`)
    }

    // Filter the posts based on the search query
    const filteredData = props.posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );


    //gets users id
    const [image, setImage] = useState(null)


    //gets the current users data 
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await show(props.user._id)
            setImage(userData.user.image);
        }
        fetchUser();
    }, []);


    return (
        <>
            {props.user ? (
                <nav className={styles.container}>
                    <Link className="logo-brandname" to='/'>
                        <button className={`btn ${styles.btn}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </button>
                        <img src={Logo} width={75} alt="" />
                        <div className="display-4">BuzzPage</div>
                    </Link>
                    <div className={styles.links}>
                        <Link className='h2' to={`/users/profile/${props.user._id}`}><img src={image} alt="" className={`img-fluid ${styles.profile}`} />Hello {props.user.username}</Link>
                        <Link className='h2' to='users/signin' onClick={props.handleSignout}>Sign Out</Link>
                    </div>
                </nav>

            ) : (
                <nav className={styles.container}>
                    <Link className="logo-brandname" to='/'>
                        <img src={Logo} width={75} alt="" />
                        <div className="display-4">BuzzPage</div>
                    </Link>

                    <div className={styles.links}>
                        <Link className='h2' to='users/signup'>Sign Up</Link>
                        <Link className='h2' to='users/signin'>Login</Link>
                    </div>
                </nav>
            )}


            {/* Side bar */}

            <div className="offcanvas offcanvas-start text-bg-dark" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header border-bottom mx-2">
                    <img src={Logo} width={100} alt="" />
                    <h5 className="offcanvas-title h2" id="offcanvasWithBothOptionsLabel">BuzzPage</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p className='text-center h3 mb-3'>Daily News</p>

                    {/* <NewsSlider /> */}
                    <button data-bs-dismiss="offcanvas" className={`btn mb-3 ${styles.createPostBtn}`} onClick={handleClick}>
                        Create New Post
                    </button>
                    <p className='text-md-center'>Search Posts by Title</p>
                    <input
                        className='form-control mb-3'
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleChange}
                    />
                    <p className='text-center h3 mb-3'>All Posts</p>
                    {filteredData.length > 0 ? filteredData.map((post, index) => {
                        return (
                            <div key={index} className='p-3'>
                                <div className={styles.postTitle}>
                                    <h5>Title:</h5>
                                    <Link className='h5 text-light' to={`/posts/${post._id}`}> {post.title}</Link>
                                </div>
                                <h5 className='border-bottom pb-2'>Description: {post.text}</h5>
                            </div>
                        )
                    }
                    ) : <p>No Matching Posts</p>}
                </div>
            </div>
        </>
    );
}

export default NavBar;