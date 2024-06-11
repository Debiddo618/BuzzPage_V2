import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as postService from '../../services/postService';
import { Link } from "react-router-dom";
import { AuthedUserContext } from '../../App';
import Comment from '../Comment/Comment';
import styles from './SinglePost.module.css'

const SinglePost = (props) => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const currentUser = useContext(AuthedUserContext);

    const [post, setPost] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState({ text: "" });



    useEffect(() => {
        const fetchPostComment = async () => {
            let postData;
            if (postId) {
                postData = await postService.show(postId);
            } else {
                postData = props.postData;
            }
            setPost(postData);
        };
        fetchPostComment();
    }, [postId, editCommentId]);



    const handleAddComment = async (comment) => {
        const updatedPost = { ...post };
        updatedPost.comments.push(comment);
        setPost(updatedPost);
        const collapseElement = document.getElementById('collapseExample');
        if (collapseElement) {
            collapseElement.classList.add('show');
        }
    }

    const handleDeleteComment = async (commentId) => {
        await postService.deleteComment(postId, commentId);
        const updatedPost = { ...post };
        updatedPost.comments = updatedPost.comments.filter(comment => comment._id !== commentId);
        setPost(updatedPost);
    }

    const handleToggleEdit = (commentId, commentText) => {
        setEditCommentId(commentId);
        setEditedCommentText(commentText);
    }

    const handleSaveEdit = async (commentId) => {
        await postService.updateComment(postId, commentId, editedCommentText);
        setEditCommentId(null);
    }

    // going back to the home page
    const handleClick = () => {
        navigate(`/`);
    }

    // handle liking a post
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
        <div className={styles.container}>
            {post &&
                <div className="card" style={{ width: "30rem" }}>
                    <img src={post.photo} className="card-img-top" style={{ height: "300px", objectFit: "cover" }} />
                    <div className="card-body bg-dark">
                        <div className="d-flex gap-1 mb-2">
                            <div className={styles.like} style={{ color: "#F4BE1E" }}>
                                {post.like} Likes
                                <button className="btn btn-primary" onClick={() => handleLikeClick("like")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                        <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                                    </svg>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleLikeClick("dislike")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heartbreak-fill" viewBox="0 0 16 16">
                                        <path d="M8.931.586 7 3l1.5 4-2 3L8 15C22.534 5.396 13.757-2.21 8.931.586M7.358.77 5.5 3 7 7l-1.5 3 1.815 4.537C-6.533 4.96 2.685-2.467 7.358.77" />
                                    </svg>
                                </button>
                            </div>
                            {postId && currentUser && currentUser._id === post.author._id && (
                                <>
                                    <button className="btn btn-success">
                                        <Link
                                            className={`text-light ${styles.edit}`}
                                            to={`/users/${currentUser._id}/posts/${postId}/edit`}
                                        >
                                            Edit Post
                                        </Link>
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => props.handleDeletePost(post._id)}> Delete Post
                                    </button>
                                </>
                            )}
                        </div>
                        <h5 className="card-title" style={{ color: "#F4BE1E" }}
                        >
                            <Link
                                className={`${styles.link}`}
                                to={`/posts/${post._id}`}
                            >
                                <p style={{ color: "#F4BE1E" }}>
                                    {post.title} by {post.author.username}
                                </p>
                            </Link>                        </h5>
                        <p className="card-text" style={{ color: "#F4BE1E" }}
                        >{post.text}</p>

                        {/* Collapse button and back to hive */}
                        <div className="d-inline-flex gap-1">
                            <button
                                className={`btn btn-link mb-2 ${styles.link}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${post._id}`}
                                aria-expanded="false"
                                aria-controls="collapseExample"
                                style={{ color: "#F4BE1E" }}
                            >
                                {post.comments.length ? <h6> View all {post.comments.length} comments</h6> : <h6>No Comments</h6>}

                            </button>

                        </div>

                        <div className="collapse" id={`${post._id}`}>
                            <div className="card card-body">
                                <div className="comment-section">
                                    <h3 className='text-center'>Comments</h3>
                                    <div className="comments">
                                        {post.comments &&
                                            post.comments.map((comment, index) => (
                                                <div key={index}>
                                                    {editCommentId === comment._id ? (
                                                        <div className='border p-3'>
                                                            <p>{comment.authorName}:
                                                                <input
                                                                    type="text"
                                                                    value={editedCommentText.text}
                                                                    onChange={(e) =>
                                                                        setEditedCommentText({ text: e.target.value })
                                                                    }
                                                                />
                                                                <button className='mx-1' onClick={() => handleSaveEdit(comment._id)}>
                                                                    Save
                                                                </button>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className='d-flex flex-column border p-3'>
                                                            <p>
                                                                {comment.authorName}: {comment.text}
                                                            </p>
                                                            {currentUser && currentUser._id === post.author._id && (
                                                                <div className='d-flex gap-1 align-items-baseline'>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleToggleEdit(comment._id, comment.text)
                                                                        }
                                                                        className={`btn-link ${styles.btn}`}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className={`btn-link ${styles.btn}`}
                                                                        onClick={() =>
                                                                            handleDeleteComment(comment._id)
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                    }
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Comment handleAddComment={handleAddComment} postId={post._id} />
                    </div>
                </div>
            }
        </div>
    );
}

export default SinglePost;