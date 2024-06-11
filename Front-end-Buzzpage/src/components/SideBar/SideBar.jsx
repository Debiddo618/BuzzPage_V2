import { useState, useContext } from "react";
import { AuthedUserContext } from '../../App';
import { useNavigate, Link } from "react-router-dom";


const SideBar = (props) => {
    const user = useContext(AuthedUserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleClick = (e) => {
        navigate(`/users/${user._id}/posts/new`)
    }

    const handleEdit = (e) => {
        navigate(`/users/profile/${user._id}/edit`)
    }

    // Filter the posts based on the search query
    const filteredData = props.posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <>
            <div className="container bg-dark" style={{ minHeight: '100vh' }}>
                <div className={'card bg-dark border-dark'}>
                    <img src={props.user.image} className="card-img-top" style={{ width: "60%", height: "10%" }} alt="..." />
                    <h1 className="card-title fw-bold fst-italic text-warning text-center">{props.user.username}</h1>
                    <div className="border-bottom pb-2 d-flex justify-content-center gap-2">
                        <button className="btn btn-warning text-light" onClick={handleEdit}>Edit User</button>
                        <button className="btn text-light" style={{ backgroundColor: "#F16943" }} onClick={props.deleteMenu}>Delete Account</button>
                    </div>
                </div>
                <div className="d-flex flex-column gap-3">
                    <button className="btn text-light w-100 mt-3" style={{ backgroundColor: "#F4BE1E" }} onClick={handleClick}>New Post</button>
                    <input
                        className="form-control mb-3"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleChange}
                    />
                </div>

                {filteredData.length > 0 ? filteredData.map((post, index) => {
                    return (
                        <div key={index} className="text-warning mt-4">
                            <p>Title: {post.title}</p>
                            <p>Description: {post.text}</p>
                            <hr />
                        </div>
                    )
                }
                ) : <p className="text-warning">No Matching Posts</p>}
            </div>
        </>
    );
}

export default SideBar;