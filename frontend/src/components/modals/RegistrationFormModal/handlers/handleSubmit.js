import { notHiddenStoragePage, notHiddenUserAdminPage } from '../../../../redux/slices/menuSlice';
import { invisibleRegistrationForm } from '../../../../redux/slices/formSlice';
import { fetchHomeStatic } from '../../../../fetch/fetchHomeStatic';
import { fetchUserLogin } from '../../../../fetch/fetchUserLogin';
import { fetchRegisterUser } from '../../../../fetch/fetchRegisterUser';


export default async function handleSubmit(dispatch, values, isCheckedAdmin) {
  values.isStaff = isCheckedAdmin;
  await dispatch(fetchRegisterUser(values))
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
      const { error_code, detail } = error;
      if (error_code === 'USERNAME_ALREADY_EXISTS') {
        alert(detail);
      } else if (error_code === 'EMAIL_ALREADY_EXISTS') {
        alert(detail);
      } else {
        alert('Произошла неизвестная ошибка.');
      }
    });
};

