import { useState } from 'react';
import { Link } from "react-router-dom";
import styles from './HiveFeed.module.css'
import AllPosts from '../AllPosts/AllPosts';
import PageTransition from '../PageTransition/PageTransition';
import NewsSlider from '../NewsSlider/NewsSlider'
import Posts from '../Posts/Posts';

const handleClick = (e) => {
    navigate(`/users/${user._id}/posts/new`)
}

const HiveFeed = (props) => {
    return (
        <div className={styles.container}>
            <PageTransition />
            <main>
                <h1 className='text-center text-light'>Welcome to the HIVE! Here's the latest BUZZ:</h1>
                {/* {props.AllPosts.length > 0 ? <AllPosts AllPosts={props.AllPosts} /> : <h1 className='text-center'>No Post Yet!</h1>} */}
                {props.AllPosts.length > 0 ? <Posts AllPosts={props.AllPosts} handleDeletePost={props.handleDeletePost} /> : <h1 className='text-center'>No Post Yet!</h1>}
            </main>
        </div>

    )
}


export default HiveFeed;