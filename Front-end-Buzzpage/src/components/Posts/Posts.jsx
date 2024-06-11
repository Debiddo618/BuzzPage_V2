import SinglePost from "../SinglePost/SinglePost";

const Posts = (props) => {
    return (
        <div className="row">
            {props.AllPosts.map((post, index) => {
                return (
                    <div className="col-md-3" key={index}>
                        <SinglePost postData={post} handleDeletePost={props.handleDeletePost} />
                    </div>
                )
            })}
        </div>
    );
}

export default Posts;