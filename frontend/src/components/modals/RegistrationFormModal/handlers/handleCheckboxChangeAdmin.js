import { fetchAuthAdmin } from "../../../../fetch/fetchAuthAdmin";

export default function handleCheckboxChangeAdmin(dispatch, isCheckedAdmin, setIsCheckedAdmin) {
  let auchAdmin = prompt('введите пароль администратора');
  dispatch(fetchAuthAdmin({ auchAdmin: auchAdmin }))
    .then(payload => {
      if (payload.payload === true) {
        setIsCheckedAdmin(!isCheckedAdmin);
      } else {
        alert('Неверный пароль Администратора')
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
};
