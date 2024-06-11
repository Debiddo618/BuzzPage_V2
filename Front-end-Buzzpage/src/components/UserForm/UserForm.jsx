import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { show, update } from '../../services/profileService';
import styles from './UserForm.module.css'
/*-----------------import default img----------------- */
import default1 from '../../assets/images/default icon 1.png'
import default2 from '../../assets/images/default icon 2.png'
import default3 from '../../assets/images/default icon 3.png'
import PageTransition from '../PageTransition/PageTransition';

const UserForm = (props) => {
    const navigate = useNavigate()

    //default form state variable
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: ''
    });

    //fetch to the users data and store it in form
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await show(props.user._id)
            setFormData(userData.user);
        }
        fetchUser();
    }, []);
    console.log({ formData })

    //handles any change to the form data
    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    //submits the form and navigate back to user page
    const handleSubmit = (evt) => {
        evt.preventDefault()
        props.handleUpdateUser(props.user._id, formData)
    }

    //cancel the form and return to userPage
    const handleBack = () => {
        navigate(`/users/profile/${props.user._id}`)
    }

    return (
        <div>
            <PageTransition />
            <main className={styles.container} >
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="card bg-dark p-5 border-warning">
                        <div className="form-text text-warning text-center fs-1">Your page is buzzing for a change</div>
                        <div className={`mt-3 mb-4  ${styles.pictureFrame}`}>
                            <label htmlFor="picture"></label>
                            <select className={styles.picture} name="image" id="picture" value={formData.image} style={{ backgroundiImage: `url("${formData.image}")` }} onChange={handleChange}>
                                <option className={styles.grey} value={"https://i.imgur.com/XeEfWCU.png"}>Grey</option>
                                <option className={styles.red} value={"https://i.imgur.com/2nCztPl.png"}>Red</option>
                                <option className={styles.yellow} value={"https://i.imgur.com/49qkZEK.png"}>Yellow</option>
                                <option className={styles.blue} value={"https://i.imgur.com/rijvXoW.png"}>Blue</option>
                            </select>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control me-2 border-warning"
                                    name="firstName"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col" >
                                <input
                                    type="text"
                                    className="form-control me-2 border-warning"
                                    name="lastName"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bio" className="form-label">Bio:</label>
                            <textarea
                                type="text"
                                className="form-control border-warning"
                                name="bio"
                                id="bio"
                                rows="3"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-warning border-dark">Edit info</button>
                        <div className='d-flex align-self-center mt-3'>
                            <button onClick={handleBack} className="btn-close bg-warning " />
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default UserForm;