import { useSelector, useDispatch } from "react-redux";
import { fetchRegisterUser } from '../../fetch/fetchRegisterUser';
import { fetchLoginUser } from "../../fetch/fetchLoginUser";
import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { hiddenStoragePage, hiddenUserAdminPage } from '../../redux/slices/menuSlice';
import { invisibleRegistrationForm } from '../../redux/slices/formSlice';
import { logout } from "../../redux/slices/menuRegSlice";
import './register-form.css'

export default function RegistrationForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errorMessage } = useSelector((state) => state.user);
  const isModalRegistrationForm = useSelector((state) => state.form.isModalRegistrationForm);
  const [isCheckedAdmin, setIsCheckedAdmin] = useState(false);
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleCancel = () => {
    dispatch(invisibleRegistrationForm());
    dispatch(logout());
    dispatch(hiddenStoragePage());
    dispatch(hiddenUserAdminPage());
    navigate('/');
    location.reload(true);
  };

  const handleCheckboxChangeAdmin = () => {
    let auchAdmin = prompt('введите пароль администратора');
    if (auchAdmin === ADMIN_PASSWORD) {
      setIsCheckedAdmin(!isCheckedAdmin);
    } else {
      alert('Неверный пароль Администратора')
    };
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z][a-zA-Z0-9]{3,19}$/, 'Логин должен начинаться с буквы и содержать только латиницу и цифры.')
      .required('Логин обязателен.'),
    email: Yup.string()
      .email('Некорректный формат email.')
      .required('Email обязателен.'),
    firstname: Yup.string()
      .required('Полное имя обязательно.'),
    password: Yup.string()
      .min(6, 'Минимум 6 символов.')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$/, 'Пароль должен содержать хотя бы одну заглавную букву, цифру и спецсимвол.')
      .required('Пароль обязателен.'),
  });

  return (
    <>
      {isModalRegistrationForm && (
        <div className="modal-box-form-reg">
          <div className="modal-form-reg">
            <Formik
              initialValues={{ username: "", firstname: "", email: "", password: "", isStaff: false }}
              validationSchema={validationSchema}
              onSubmit={async(values) => {
                values.isStaff = isCheckedAdmin;
                await dispatch(fetchRegisterUser(values))
                  .unwrap()
                  .then((message) => {
                    alert(message.message);
                    dispatch(invisibleRegistrationForm());
                    dispatch(fetchLoginUser({ username: values.username, password: values.password })).unwrap();
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
              }}
            >
              {({ isSubmitting }) => (
                <Form className="register-form">
                  <Field type="text" name="username" placeholder="Логин" />
                  <ErrorMessage name="username" component="div" style={{ color: "red" }} />
                  <Field type="text" name="firstname" placeholder="Полное имя" />
                  <ErrorMessage name="firstname" component="div" style={{ color: "red" }} />
                  <Field type="email" name="email" placeholder="Электронная почта" />
                  <ErrorMessage name="email" component="div" style={{ color: "red" }} />
                  <Field type="password" name="password" placeholder="Пароль" />
                  <ErrorMessage name="password" component="div" style={{ color: "red" }} />

                  <div className="box-checkbox">
                    <p className="name-checkbox">Признак Администратора</p>
                    <label name="is_staff" className="label-admin">
                      <input className="input-admin"
                        type="checkbox"
                        checked={isCheckedAdmin}
                        onChange={handleCheckboxChangeAdmin}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <button className="button-reg-form-submit" type="submit" disabled={isSubmitting || loading}>Зарегистрироваться</button>
                  <button className="button-reg-form-cancel" onClick={handleCancel}>Отмена</button>
                  {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
