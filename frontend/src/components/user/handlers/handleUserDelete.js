import { fetchUserDelete } from '../../../fetch/fetchUserDelete';
import { fetchUsers } from '../../../fetch/fetchUsers';


export const handleUserDelete = ({ yourUser, dispatch, navigate, id, token, username, currentPage}) => {
  let actions = confirm("Вы уверены что хотите УДАЛИТЬ Пользователя?");
  if (actions) {
    const userId = id;
    console.log(userId, token);

    dispatch(fetchUserDelete({ userId, token }))
      .unwrap()
      .then(response => {
        if (response.status === 204) {
          alert(`Пользователь login: ${username} УДАЛЕН!`);
          console.log(`Пользователь login: ${username} УДАЛЕН!`);
          dispatch(fetchUsers({ userId: yourUser, page: currentPage }));
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
}
