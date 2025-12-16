import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchUserStatusAdmin } from '../../fetch/fetchUserStatusAdmin';
import { useNavigate } from 'react-router-dom';
import { setUserId } from '../../redux/slices/fileSlice';
import { handleUserDelete } from './handlers/handleUserDelete'

import './user-property.css';


export default function UserProperty({ user, currentPage, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, username, first_name, email, file_count, total_size, is_staff } = user;
  const token = useSelector((state) => state.login.results).token;
  const yourUser = useSelector((state) => state.login.results).userId;
  const [isChecked, setIsChecked] = useState(is_staff);

  let userCss = '';
  if (yourUser === id) {
    userCss = 'item-user';
  };

  const handleCheckboxChange = () => {
    const newIsStaff = !isChecked;
    dispatch(fetchUserStatusAdmin({ userId: id, newIsStaff, token }));
    setIsChecked(!isChecked);
  };

  const handleUserClick = () => {
    dispatch(setUserId(id));
    navigate('/storage');
  };

  return (
    <>
      <tr>
        <td className={userCss}>{index}</td>
        <td className={userCss}>{username}</td>
        <td className={userCss}>{first_name}</td>
        <td className={userCss}>{email}</td>
        <td className={userCss}>{file_count}</td>
        <td className={userCss}>{Math.round(total_size / 1024)} KB</td>
        <td>
          <label className="label-admin">
            <input className="input-admin"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark"></span>
          </label>
        </td>
        <td className="button-user-actions">
          <button onClick={handleUserClick} className='button-user-link'> Go </button>
          <button onClick={() => { handleUserDelete({ yourUser, dispatch, navigate, id, token, username, currentPage }) }} className='button-user-delete'> Del </button>
        </td>
      </tr>
    </>
  )
};
