const BACKEND_URL ='/api';


// index to show all post "Hive Feed"
const index = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
};

//show a selected post
const show = async (postId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
};

//create a new post 
const create = async (photoData=null,postFormData) => {
    try {
      let uploadedPhoto;
      if(photoData){
        const photoRes = await fetch(`${BACKEND_URL}/posts/photoUpload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: photoData ,
        });
        // actual url for the aws photo link
        uploadedPhoto = await photoRes.json(); 
      }
      // console.log(postFormData);

      // adding url to the post.photo if it exist or leave blank 
      postFormData.photo = uploadedPhoto ? uploadedPhoto : "";

      // saving into mongodb
      const res = await fetch(`${BACKEND_URL}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postFormData) ,
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
};

//update a users post
const update = async (postId, postFormData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postFormData),
      });
      return res.json();
      
    } catch (error) {
      console.log(error);
    }
}

//delete the users post and return deleted post
const deletePost = async (postId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
};

// create comment and return the comment
const createComment = async (postId, commentFormData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

//update comment service
const updateComment = async (postId,commentId, commentFormData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

//delete comment service
const deleteComment = async (postId, commentId,) => {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'Delete',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};


export { index, show, create, update , deletePost, createComment, updateComment, deleteComment }; 