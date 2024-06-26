import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as postService from '../../services/postService';
import { Link } from "react-router-dom";
import { AuthedUserContext } from '../../App';
import Comment from '../Comment/Comment';
import styles from "./PostDetails.module.css"

const PostDetails = (props) => {

    const { postId } = useParams();
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
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState({ text: "" });


    useEffect(() => {
        const fetchPostComment = async () => {
            const postData = await postService.show(postId);
            setPost(postData);
        };
        fetchPostComment();
    }, [postId, editCommentId]);


    const handleAddComment = async (comment) => {
        const updatedPost = { ...post };
        updatedPost.comments.push(comment);
        setPost(updatedPost);
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
        <>
            <div className={styles.container}>
                <div className="card" style={{ width: "40rem" }}>
                    <img src={post.photo} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">
                            {post.author.username} says:
                        </h6>
                        <div className=''>
                            {post.like} Likes
                            <button className="btn btn-primary m-1" onClick={() => handleLikeClick("like")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                                </svg>                            </button>
                            <button className="btn btn-danger m-1" onClick={() => handleLikeClick("dislike")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heartbreak-fill" viewBox="0 0 16 16">
                                    <path d="M8.931.586 7 3l1.5 4-2 3L8 15C22.534 5.396 13.757-2.21 8.931.586M7.358.77 5.5 3 7 7l-1.5 3 1.815 4.537C-6.533 4.96 2.685-2.467 7.358.77" />
                                </svg>
                            </button>
                        </div>

                        <p className="card-text">{post.text}</p>

                        {currentUser && currentUser._id === post.author._id && (
                            <>
                                <button className="btn btn-secondary">
                                    <Link
                                        className={styles.link}
                                        to={`/users/${currentUser._id}/posts/${postId}/edit`}
                                        style={{ textDecoration: 'none', color: 'white' }}>Edit</Link>
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => props.handleDeletePost(post._id)}> Delete
                                </button>
                            </>
                        )}

                        <div className="d-inline-flex gap-1">
                            <button
                                className="btn btn-secondary mb-2"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseExample"
                                aria-expanded="false"
                                aria-controls="collapseExample"
                            >Comments</button>

                            <button className="btn btn-secondary mb-2" onClick={handleClick}>Back to the Hive
                            </button>
                        </div>

                        <div className="collapse" id="collapseExample">
                            <div className="card card-body">
                                <div className="comment-section">
                                    <h1>Comments</h1>
                                    <div className="comments">
                                        <ol>
                                            {post.comments &&
                                                post.comments.map((comment, index) => (
                                                    <li key={index}>
                                                        {editCommentId === comment._id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={editedCommentText.text}
                                                                    onChange={(e) =>
                                                                        setEditedCommentText({ text: e.target.value })
                                                                    }
                                                                />
                                                                <button onClick={() => handleSaveEdit(comment._id)}>
                                                                    Save
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {comment.text}
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
                                                                                handleDeleteComment(comment._id)
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </>
                                                        )
                                                        }
                                                    </li>
                                                ))}
                                        </ol>
                                    </div>
                                    <Comment handleAddComment={handleAddComment} postId={post._id} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default PostDetails; 
