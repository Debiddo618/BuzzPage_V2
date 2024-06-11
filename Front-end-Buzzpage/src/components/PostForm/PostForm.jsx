import { useState, useRef, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as postService from '../../services/postService'
import PageTransition from '../PageTransition/PageTransition';
import { AuthedUserContext } from '../../App';
import styles from './PostForm.module.css'

const postForm = (props) => {
    const fileInputRef = useRef();
    const { userId } = useParams();
    const { postId } = useParams();
    const currentUser = useContext(AuthedUserContext);
    const [formData, setFormData] = useState({
        author: currentUser ? currentUser._id : "",
        title: '',
        text: '',
        photo: '',
        category: 'News',
    });


    // fetch the users post and store in post form
    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                try {
                    const post = await postService.show(postId);
                    setFormData({
                        author: post.author._id,
                        title: post.title,
                        text: post.text,
                        image: post.image,
                        category: post.category,
                    });
                } catch (error) {
                    console.error('failed to fetch post', error);
                }
            };
            fetchPost();
        }
    }, [postId]);

    // create POST
    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleChangeImage = (evt) => {
        const newFormData = { ...formData, [evt.target.name]: URL.createObjectURL(evt.target.files[0]) };
        setFormData(newFormData);
    }

    //Handle create post & submit to DB
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (postId) {
            props.handleUpdatePost(postId, formData);
        } else {
            let photoData;
            formData.photo = '';
            if (fileInputRef.current.value !== '') {
                photoData = new FormData()
                photoData.append('title', formData.title)
                photoData.append('photo', fileInputRef.current.files[0]);
            }
            props.handleAddPost(photoData, formData);
        }
    };

    return (
        <div className={styles.container}>
            <PageTransition />

            <form className={`border container-m p-5 h-75 w-50 mx-auto bg-dark text-light ${styles.form}`} onSubmit={handleSubmit}>
                {postId ? <div className="display-3 text-center">Edit Post</div> : <div className="display-3 text-center">Create Post</div>
                }

                {formData.photo ? (
                    <div className="text-center">
                        <img className="img-fluid mb-3 w-25 mx-auto" src={formData.photo} alt="profilePic" />
                    </div>
                ) : ""}

                <div className="mb-2">
                    <label
                        htmlFor="title"
                        className="form-label"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="text"
                        className="form-label"
                    >
                        Description
                    </label>
                    <textarea
                        type="text"
                        className="form-control mb-3"
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group mb-3">
                    <input
                        onChange={handleChangeImage}
                        type="file"
                        className="form-control"
                        name='photo'
                        id="image"
                        ref={fileInputRef}
                    />
                    <label className="input-group-text" hmtlfor="image">Upload Image</label>
                </div>

                <div className="form-group">
                    <label className='form-label' hmtlfor="category">Category</label>
                    <select
                        className="form-control mb-3"
                        required
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="News">News</option>
                        <option value="Sports">Sports</option>
                        <option value="Games">Games</option>
                        <option value="Movies">Movies</option>
                        <option value="Music">Music</option>
                        <option value="Television">Television</option>
                    </select>
                </div>
                {postId ? <button type="submit" disabled={""} className={`btn btn-primary w-100 ${styles.button}`}>Edit Post</button>
                    : <button type="submit" disabled={""} className={`btn btn-primary w-100 ${styles.button}`}>Create Post</button>
                }
            </form>



        </div>
    );
}

export default postForm;