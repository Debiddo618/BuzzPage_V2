import { useState } from "react";
import * as postService from '../../services/postService';

const Comment = (props) => {
    const [formData, setFormData] = useState({ text: '' });

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const newComment = await postService.createComment(props.postId, formData);
        props.handleAddComment(newComment, props.postId);
        setFormData({ text: '' });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="text"
                        id="text"
                        value={formData.text}
                        onChange={handleChange}>
                    </input>
                    <button style={{ backgroundColor: "#F4BE1E", border: "none" }} class="btn btn-outline-secondary text-light" type="submit" id="button-addon2">Button</button>
                </div>

            </form>
        </>
    );





}

export default Comment;