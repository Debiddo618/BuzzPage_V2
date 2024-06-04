import { Link } from "react-router-dom";
import styles from './AllPosts.module.css';


// all user posts
const AllPosts = (props) => {
    console.log(props.AllPosts)
    return ( 
        <div className={styles.container}>
            <h1>All Posts</h1>

            {props.AllPosts.map((post, index) => {
                return (
                    <>
                        <Link to={`/posts/${post._id}`}>{post.title}</Link>
                        <h2>{post.author.username} says: {post.text}</h2>
                        <h2>{post.image}</h2>
                        <hr />
                    </>
                )
            })}
        
        </div>
     );
}
 
export default AllPosts;