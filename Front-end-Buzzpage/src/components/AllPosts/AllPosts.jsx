import { Link } from "react-router-dom";
import styles from "./AllPosts.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthedUserContext } from "../../App";
import Comment from '../Comment/Comment';
import * as postService from '../../services/postService';



const AllPosts = (props) => {
    const navigate = useNavigate();
    const currentUser = useContext(AuthedUserContext);

    const [post, setPost] = useState({
        title: '',
        text: '',
        image: '',
        category: 'News',
        author: "",
        comments: []
    });

    const [postIdEdit, setPostIdEdit] = useState(null);

    const [editCommentId, setEditCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState({ text: "" });

    useEffect(() => {
        const fetchPostComment = async () => {
            const postData = await postService.show(postIdEdit);
            setPost(postData);
        };
        if (postIdEdit) fetchPostComment();
    }, [postIdEdit, editCommentId]);

    const handleAddComment = async (comment, postId) => {
        const updatedPost = { ...post };
        updatedPost.comments.push(comment);
        setPost(updatedPost);
        setPostIdEdit(postId);
    }

    const handleDeleteComment = async (postId, commentId) => {
        await postService.deleteComment(postId, commentId);
        const updatedPost = { ...post };
        updatedPost.comments = updatedPost.comments.filter(comment => comment._id !== commentId);
        setPost(updatedPost);
    }

    const handleToggleEdit = (commentId, commentText) => {
        setEditCommentId(commentId);
        setEditedCommentText(commentText);
    }

    const handleSaveEdit = async (commentId, postId) => {
        await postService.updateComment(postId, commentId, editedCommentText);
        setEditCommentId(null);
        const updatedPost = await postService.getPost(postId);
        setPost(updatedPost);
        setEditCommentId(null);
    }

    const handleLikeClick = async (arg) => {
        let likes;
        if (arg === "like") {
            likes = post.like + 1;
        } else {
            likes = post.like - 1;
        }
        setPost({ ...post, like: likes });
        const updatedPost = await postService.update(post._id, { like: likes });
        setPost(updatedPost);
    };

    return (
        <main className="mx-2 d-flex justify-content-center">
            {props.AllPosts.map((post, index) => (
                <div className="col-md-3" key={index}>
                    <div className="card">
                        <img src={post.photo} className="card-img-top" alt="..." />
                        <div className="card-body bg-dark">
                            <h5 className="card-title">
                                <Link
                                    className={`${styles.link}`}
                                    to={`/posts/${post._id}`}
                                >
                                    <p style={{ color: "#F4BE1E" }}>
                                        {post.title} by {post.author.username}
                                    </p>
                                </Link>
                            </h5>
                            <p className={`card-text ${styles.text}`}>{post.text}</p>
                            <button
                                style={{ color: "#F4BE1E" }}
                                className={`btn btn-link ${styles.btn}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseExample"
                                aria-expanded="false"
                                aria-controls="collapseExample"
                            >
                                {post.comments.length ? <h6>{post.comments.length} comments</h6> : <h6>No Comments</h6>}
                            </button>

                            <div className="collapse h-50" id="collapseExample">
                                <div className="card card-body">
                                    <div className="comment-section">
                                        <h1>Comments</h1>
                                        <div className="comments">
                                            <div>
                                                {post.comments &&
                                                    post.comments.map((comment, index) => (
                                                        <div key={index}>
                                                            {editCommentId === comment._id ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={editedCommentText.text}
                                                                        onChange={(e) =>
                                                                            setEditedCommentText({ text: e.target.value })
                                                                        }
                                                                    />
                                                                    <button onClick={() => handleSaveEdit(comment._id, post._id)}>
                                                                        Save
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {comment.authorName}: {comment.text}
                                                                    {currentUser && currentUser._id === post.author._id && (
                                                                        <>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleToggleEdit(comment._id, comment.text)
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDeleteComment(post._id, comment._id)
                                                                                }
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )
                                                            }
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <Comment handleAddComment={handleAddComment} postId={post._id} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
};

export default AllPosts;