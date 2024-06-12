import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { show } from '../../services/profileService';
import PageTransition from '../PageTransition/PageTransition';
import SideBar from '../SideBar/SideBar';
import styles from './User.module.css'

const User = (props) => {
    //gets users id
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    //gets the current users data 
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await show(userId)
            setUser(userData.user);
        }
        fetchUser();
    }, []);


    const deleteMenu = (event) => {
        setIsOpen(!isOpen);
    }

    const handleEdit = (e) => {
        navigate(`/users/${user._id}/posts/new`)
    }

    //show loading until its gets user
    if (!user) return (
        <>
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-warning" style={{ width: '30rem', height: '30rem', marginTop: '10rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    );

    return (
        <>
            <PageTransition />
            <div className={`${styles.container}`}>
                <div className="row">
                    <div className="col-3" style={{ minHeight: "100vh" }}>
                        <SideBar posts={user.posts} user={user} deleteMenu={deleteMenu} />
                    </div>
                    <div className="col-9">
                        <div className="row w-100 mt-3 d-flex justify-content-between">
                            <div className={`card bg-dark d-flex justify-content-center align-items-center`} style={{ width: "55%" }}>
                                <img src={user.image} className="card-img-top h-75 w-75" alt="..." />
                                <div className="card-body">
                                    <h1 className="card-text fw-bold fst-italic" style={{ color: "#F4BE1E" }}>{user.username}</h1>
                                </div>
                            </div>

                            <div className={`card d-flex bg-dark p-3`} style={{ color: "#F4BE1E", width: "44%" }}>
                                <h2 className="card-text text-center mt-1">Beekeeper Bio:</h2>
                                <div className="bio p-3 d-flex flex-column gap-3">
                                    <h3>UserId: {user._id}</h3>
                                    <h3>First Name: {user.firstName}</h3>
                                    <h3>Last Name: {user.lastName}</h3>
                                    {user.bio ?
                                        <>
                                            <h3>Bio: {user.bio}</h3>
                                            <button className="btn text-light mx-auto w-75 mt-5" style={{ backgroundColor: "#F4BE1E" }} onClick={handleEdit}>Edit Bio</button>
                                        </>

                                        :
                                        <>
                                            <div className="d-flex justify-content-center flex-column">
                                                <p className="card-body text-center fs-2 ">No honey in this nest</p>
                                                <div className="d-flex justify-content-center">
                                                    <div className="spinner-grow text-warning " style={{ width: '5rem', height: '5rem' }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>

                                {/* for later development/ only allow user to edit or delete their own page */}
                                {props.user._id !== userId ? (''
                                ) : (
                                    <>
                                        {isOpen && (
                                            <div className={`container-m h-100 w-100 text-dark d-flex flex-column justify-content-center fs-1 ${styles.popup}`} >Are you sure you want to buzz away
                                                <div className='row '>
                                                    <div className='col'>
                                                        <button className="btn btn-warning" onClick={() => props.handleDeleteUser(userId)}>Confirm</button>
                                                    </div>
                                                    <div className='col'>
                                                        <button className={`btn btn-warning ${styles.cancel}`} onClick={deleteMenu}>Deny</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <h1 className={"m-3 text-light text-center"}>My Posts</h1>

                            <div className={`d-flex`}>
                                {user.posts.length === 0 ? (
                                    <div className="card h-100 bg-dark mt-3 w-75 mx-auto" >
                                        <div className="card-body justify-content-center d-flex flex-column">
                                            <h1 className="card-title justify-self-center text-center" style={{ color: "#F4BE1E" }}>NO POST</h1>
                                            <p className="card-text text-center" style={{ color: "#F4BE1E" }}>You need to get buzzing to the hive little bee</p>
                                            <button className="btn btn-lg text-light w-50 mx-auto" style={{ backgroundColor: "#F4BE1E" }} onClick={handleEdit}>New Post</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mx-auto">
                                        <div className='d-flex justify-content-center'>
                                            <div className='d-flex flex-wrap justify-content-center'>
                                                {user.posts.map((post) => (
                                                    <div className="card m-2 w-25" key={post._id}>
                                                        <img className="card-img-top" src={post.photo} alt="Card image cap" />
                                                        <div className="card-body bg-dark">
                                                            <h5 className="card-title" style={{ color: "#F4BE1E" }}>{post.title}</h5>
                                                            <p className="card-text" style={{ color: "#F4BE1E" }}>{post.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default User;