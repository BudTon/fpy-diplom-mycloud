import { notHiddenStoragePage, notHiddenUserAdminPage } from '../../../../redux/slices/menuSlice';
import { invisibleRegistrationForm } from '../../../../redux/slices/formSlice';
import { fetchHomeStatic } from '../../../../fetch/fetchHomeStatic';
import { fetchUserLogin } from '../../../../fetch/fetchUserLogin';
import { fetchUserRegister } from '../../../../fetch/fetchUserRegister';


export default async function handleSubmit(dispatch, values, isCheckedAdmin) {
  values.isStaff = isCheckedAdmin;
  await dispatch(fetchUserRegister(values))
    .unwrap()
    .then((message) => {
      dispatch(notHiddenStoragePage());
      if (isCheckedAdmin) {
        dispatch(notHiddenUserAdminPage())
      }
      alert(message.message);
      dispatch(invisibleRegistrationForm());
      dispatch(fetchUserLogin({ username: values.username, password: values.password })).unwrap();
      dispatch(fetchHomeStatic());
    })
    .catch((error) => {
      console.error('Ошибка при отправке файла:', error);
      const { codeError, detail } = error;
      if (codeError) {
        alert(detail);
      } else {
        alert('Произошла неизвестная ошибка.');
      }
    });
};

