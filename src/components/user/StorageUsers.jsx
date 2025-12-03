import { useSelector } from 'react-redux';
import UserProperty from './UserProperty';

export const StorageUsers = () => {
  const file = useSelector((state) => state.file.results);
  const loading = useSelector((state) => state.file.loading);
  const error = useSelector((state) => state.file.error);

  return (
    <>
      <h1>Список пользователей</h1>
      {loading ? (
        <p>Загружаю...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>логин</th>
              <th>полное имя</th>
              <th>email</th>
              <th>количество файов</th>
              <th>размер файлов</th>
              <th>статус админа</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {
              file.users !== undefined &&
              file.users.length > 0 &&
              file.users.map((user, index) => (
                <UserProperty key={user.id} user={user} index={index + 1} />
              ))
            }
          </tbody>
        </table>
      )}
    </>
  );
};

