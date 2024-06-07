const BACKEND_URL = `/api/profiles`;

// index to show the users profile page
const show = async (userId) => {
    try {
        //makes a fetch requst to the backend profile inedx route
        const res = await fetch(`${BACKEND_URL}/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
      console.log(res);
      return res.json()
    } catch (error) {
      throw error
    }
};

//Gets update route from backe end
const update = async (userId, userFormData) =>{
  try {
    //fetch update route from backend
    const res = await fetch(`${BACKEND_URL}/${userId}`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(userFormData)
  })
  return res.json()
  } catch (error) {
    throw error
  }
}

//gets user id from backend to delete
const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/${userId}`, {
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

export { show, update, deleteUser };