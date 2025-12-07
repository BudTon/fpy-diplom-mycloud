import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../redux/slices/menuRegSlice';
import { visibleLoginForm, visibleRegistrationForm } from '../../redux/slices/formSlice';
import { hiddenStoragePage, hiddenUserAdminPage } from '../../redux/slices/menuSlice';
import { useNavigate } from 'react-router-dom';
import './menu-reg.css';

export default function MenuReg() {
  const isLoggedIn = useSelector((state) => state.menuReg.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegistration = () => {
    dispatch(login());
    dispatch(visibleRegistrationForm());
  };

  const handleLogin = () => {
    dispatch(login());
    dispatch(visibleLoginForm());
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(hiddenStoragePage());
    dispatch(hiddenUserAdminPage());
    navigate('/');
    location.reload(true);
  };

  return (
    <>
      <div className="menu-reg-box">
        <div className="buttons">
          {isLoggedIn ? (
            <button className="button-menu-reg" onClick={handleLogout}>Выход</button>
          ) : (
            <>
              <button className="button-menu-reg" onClick={handleRegistration}>Регистрация</button>
              <button className="button-menu-reg" onClick={handleLogin}>Войти</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
