import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchFileUser } from '../../fetch/fetchFileUser';
import FileProperty from './FileProperty';
import { Formik } from "formik";
import { fetchFileUploaded } from '../../fetch/fetchFileUploaded';
import { useNavigate } from 'react-router-dom';
import './file-load.css';

export function StorageFiles () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const file = useSelector((state) => state.file.results);
  const { loading, error } = useSelector((state) => state.file);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);

  const handleCloseModalUpload = () => {
    setIsModalUploadOpen(false);
    navigate('/storage');
  };

  const handleOpenModalUpload = () => {
    setIsModalUploadOpen(true);
  };

  return (
    <>
      <button className="open-button" onClick={handleOpenModalUpload}>Загрузка файл</button>
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
              file.user_files !== undefined &&
              file.user_files.length > 0 &&
              file.user_files.map((file, index) => (
                <FileProperty key={file.id} file={file} index={index + 1} />
              ))
            }
          </tbody>
        </table>
      )}

      {isModalUploadOpen && (
        <div className="modal-box-form-load" >
          <div className="modal-form-load">
            <div className="form-container">
              <h2 className="form-title">Загрузка файла</h2>
              <Formik
                initialValues={{
                  selectedFile: null,
                  comment: ''
                }}
                validate={(values) => { }}
                onSubmit={(values, { resetForm, setFieldValue }) => {
                  dispatch(fetchFileUploaded(values))
                    .unwrap()
                    .then(() => {
                      alert(`Файл отправлен!\nИмя файла: ${values.selectedFile.name}\nКомментарий: ${values.comment ? values.comment : " отсуутствуют"}`);
                      dispatch(fetchFileUser({ userId: file.userId }));
                      resetForm({
                        selectedFile: null,
                        comment: '',
                      });
                      document.getElementById('selectedFile').value = '';
                    })
                    .catch((error) => {
                      console.error('Ошибка при отправке файла:', error);
                    });

                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                  <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="upload-field">
                      <label htmlFor="selectedFile">Выберите файл: <br /></label>
                      <br />
                      <input
                        type="file"
                        id="selectedFile"
                        name="selectedFile"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          setFieldValue('selectedFile', file);
                        }}
                        onBlur={handleBlur}
                      />
                      {touched.selectedFile && errors.selectedFile ? (<span className="errors">{errors.selectedFile}</span>) : null}
                    </div>
                    <div className="comment-field">
                      <textarea
                        placeholder="Напишите комментарий..."
                        rows="4"
                        name="comment"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.comment}
                      />
                      {touched.comment && errors.comment ? (<span className="errors">{errors.comment}</span>) : null}
                    </div>

                    <button type="submit" className="button-load-form-submit" disabled={isSubmitting}>
                      Загрузить файл
                    </button>
                    <button className="button-load-form-cancel" onClick={handleCloseModalUpload}>
                      Закрыть
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
