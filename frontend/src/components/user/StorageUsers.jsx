import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import UserProperty from './UserProperty';
import { useEffect } from 'react';
import { fetchUsers } from '../../fetch/fetchUsers';
import Pagination from '../pagination/Pagination';


export const StorageUsers = () => {
  const file = useSelector((state) => state.file.results);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);
  const { users } = useSelector((state) => state.users.results);
  const totalPages = useSelector((state) => state.users.results.total_pages);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = +import.meta.env.VITE_ITEMS_PER_PAGE;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers({ userId: file.userId, page: currentPage }));
  }, [dispatch, currentPage, file.userId]);



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
              <th>количество файлов</th>
              <th>размер файлов</th>
              <th>статус админа</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {
              users !== undefined &&
              users.length > 0 &&
              users.map((user, index) => (
                <UserProperty
                  key={user.id}
                  user={user}
                  currentPage={currentPage}
                  index={(currentPage - 1) * itemsPerPage + index + 1}
                />
              ))
            }
          </tbody>
        </table>
      )}
      <Pagination
        totalPages={totalPages || 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

