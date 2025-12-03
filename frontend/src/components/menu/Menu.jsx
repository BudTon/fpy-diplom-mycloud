import { NavLink } from 'react-router-dom';
import MenuReg from './MenuReg';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { useSelector } from 'react-redux';
import '../../App.css';

export default function Menu() {
  const hiddenStoragePage = useSelector((state) => state.menu.hiddenStoragePage);
  const hiddenUserAdminPage = useSelector((state) => state.menu.hiddenUserAdminPage);

  return (
    <>
      <MenuReg />
      <LoginForm />
      <RegistrationForm />
      <nav className="menu">
        <NavLink className={({ isActive }) => isActive ? 'menu__item menu__item-active' : 'menu__item'} to='/'>Главная</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'menu__item menu__item-active' : `menu__item ${hiddenStoragePage}`} to='/storage'>Хранилище</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'menu__item menu__item-active' : `menu__item ${hiddenUserAdminPage}`} to='/useradmin'>Пользователи</NavLink>
      </nav>
    </>
  )
}
