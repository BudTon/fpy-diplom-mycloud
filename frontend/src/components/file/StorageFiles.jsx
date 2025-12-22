import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import FileProperty from './FileProperty';
import { useNavigate } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import FileUploadModal from '../modals/FileUploadModal/FileUploadModal';
import { fetchFileUser } from '../../fetch/fetchFileUser';
import { useEffect } from 'react';
import './file-load.css';

export function StorageFiles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const file = useSelector((state) => state.file.results);
  const { loading, error } = useSelector((state) => state.file);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = +import.meta.env.VITE_ITEMS_PER_PAGE;

  console.log(file, ' - file');


  useEffect(() => {
    dispatch(fetchFileUser({ userId: file.userId, page: currentPage }));
    console.log(11111111);

  }, [dispatch, currentPage, file.userId]);

  console.log(222222222);

  const handleCloseModalUpload = () => {
    setIsModalUploadOpen(false);
    navigate('/storage');
  };

  const handleOpenModalUpload = () => {
    setIsModalUploadOpen(true);
  };

  return (
    <>
      <button className="open-button" onClick={handleOpenModalUpload}>Загрузка файла</button>
      <h1>Список файлов пользователя: <br />{file.user_name}</h1>
      {loading ? (
        <p>Загружаю...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>имя файла</th>
              <th>комментарий</th>
              <th>размер</th>
              <th>дата загрузки</th>
              <th>дата последнего скачивания</th>
            </tr>
          </thead>
          <tbody>
            {
              file.user_files?.length > 0 &&
              file.user_files.map((file, index) => (
                <FileProperty
                  key={file.id}
                  file={file}
                  currentPage={currentPage}
                  index={(currentPage - 1) * itemsPerPage + index + 1}
                />
              ))
            }
          </tbody>
        </table>
      )}
      <Pagination
        totalPages={file.total_pages || 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <FileUploadModal
        isModalUploadOpen={isModalUploadOpen}
        handleCloseModalUpload={handleCloseModalUpload}
        currentPage={currentPage}
        file={file}
      />
    </>
  );
}
