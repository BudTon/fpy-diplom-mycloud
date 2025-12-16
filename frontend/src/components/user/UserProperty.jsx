import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchUserStatusAdmin } from '../../fetch/fetchUserStatusAdmin';
import { fetchUserDelete } from '../../fetch/fetchUserDelete';
import { fetchFileUser } from '../../fetch/fetchFileUser';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../fetch/fetchUsers';

import './user-property.css';


export default function UserProperty({ user, currentPage, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const file = useSelector((state) => state.file.results);
  const { id, username, first_name, email, file_count, total_size, is_staff } = user;
  const token = useSelector((state) => state.user.results).token;
  const yourUser = useSelector((state) => state.user.results).userId;
  const [isChecked, setIsChecked] = useState(is_staff);
  // const results = useSelector((state) => state.user.results);

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
    dispatch(fetchFileUser({ userId: id }));
    navigate('/storage');
  };

  const handleUserDelete = () => {
    let actions = confirm("Вы уверены что хотите УДАЛИТЬ Пользователя?");
    if (actions) {
      const userId = id;
      dispatch(fetchUserDelete({ userId, token }))
        .unwrap()
        .then(response => {
          if (response.status === 204) {
            alert(`Пользователь login: ${username} УДАЛЕН!`);
            console.log(`Пользователь login: ${username} УДАЛЕН!`);
            dispatch(fetchUsers({ userId: id, page: currentPage }));

            // dispatch(fetchFileUser(results));
            navigate('/useradmin');
          } else {
            alert("Ошибка при удалении пользователя.");
            console.error(response);
          }
        })
        .catch(error => {
          alert("Ошибка при удалении пользователя.");
          console.error(error);
        });
    } else {
      alert("Вы отменили удаление.");
    };
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
          <button onClick={handleUserDelete} className='button-user-delete'> Del </button>
        </td>
      </tr>
    </>
  )
};
