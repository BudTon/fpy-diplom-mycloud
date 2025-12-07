import { useSelector, useDispatch } from "react-redux";
import { fetchLoginUser } from '../../fetch/fetchLoginUser'
import { fetchFileUser } from '../../fetch/fetchFileUser'
import { useEffect } from 'react';
import { Formik, Field, Form } from "formik";
import { useNavigate } from 'react-router-dom';
import { hiddenStoragePage, notHiddenStoragePage, hiddenUserAdminPage, notHiddenUserAdminPage } from '../../redux/slices/menuSlice';
import { invisibleLoginForm } from '../../redux/slices/formSlice';
import { logout } from "../../redux/slices/menuRegSlice";
import './login-form.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results } = useSelector((state) => state.user);
  const { isModalLoginForm } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchFileUser(results));
  }, [dispatch, results]);

  console.log(results, ' - useSelector((state) => state.user);' );

  if (results.isStaff) {
    dispatch(notHiddenUserAdminPage());
  }
  
  if (results.status !== 'ok') {
    console.warn('Пользователь еще неавторизирован');
  };

  const handleCancel = () => {
    dispatch(invisibleLoginForm());
    dispatch(logout());
    dispatch(hiddenStoragePage());
    dispatch(hiddenUserAdminPage());
    navigate('/');
    location.reload(true);
  };

  return (
    <>
      {isModalLoginForm && (
        <div className="modal-box-form">
          <div className="modal-form">
            <Formik
              initialValues={{ username: "", password: "" }}
              validate={(values) => {
              }}
              onSubmit={async (values) => {
                await dispatch(fetchLoginUser(values))
                  .unwrap()
                  .then(() => {
                    dispatch(invisibleLoginForm());
                    dispatch(notHiddenStoragePage());
                    navigate('/storage');
                  })
                  .catch((error) => {
                    alert('Ошибка проверки пользователя:', error);
                    console.error('Ошибка проверки пользователя:', error);
                  });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field type="text" name="username" placeholder="Username" />
                  <Field type="password" name="password" placeholder="Password" />
                  <button className="button-login-form-submit" type="submit" disabled={isSubmitting}>Login</button>
                  <button className="button-login-form-cancel" onClick={handleCancel}>Cancel</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
