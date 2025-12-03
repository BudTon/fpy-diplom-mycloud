import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchHomeStatic } from '../../fetch/fetchHomeStatic';
import "./home-storage.css"


export const StorageHome = () => {
  const dispatch = useDispatch();
  const { totalUsers, totalFiles, totalSize } = useSelector((state) => state.home.results);
  const { loading, error } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchHomeStatic());
  }, [dispatch]);

  return (
    <>
      <div className="welcome-stats">
        <h1>Добро пожаловать в Cloud, наше облачное хранилище!</h1>
        <h3>Мы рады приветствовать Вас среди наших активных пользователей.</h3>
        {loading ? (
          <p>Загружаю...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="stats-list">
            <li><span>Всего зарегистрировано:</span> <strong>{totalUsers ? totalUsers.countInt : ' - '} </strong> {totalUsers ? totalUsers.countStr : ' - '}</li>
            <li><span>Общий объём хранимых данных:</span> <strong>  {totalSize ? totalSize.countInt : ' - '} </strong>  {totalSize ? totalSize.countStr : ' - '}</li>
            <li><span>Количество загруженных файлов:</span> <strong> {totalFiles ? totalFiles.countInt : ' - '}</strong> {totalFiles ? totalFiles.countStr : ' - '}</li>
          </ul>
        )}
        <p >Для начала работы с Хранилищем, необходимо Войти или проитй Регистрироваться</p>
        <h2 >Наслаждайтесь комфортом, удобством и надёжностью нашего сервиса!</h2>
      </div>
    </>
  );
};
