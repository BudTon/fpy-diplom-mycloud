import { useDispatch } from 'react-redux';
import { Formik } from "formik";
import handleSubmit from './handlers/handleSubmit'


export default function FileUploadModal({ isModalUploadOpen, handleCloseModalUpload, currentPage, file }) {
  const dispatch = useDispatch();

  return (
    isModalUploadOpen && (
      <div className="modal-box-form-load">
        <div className="modal-form-load">
          <div className="form-container">
            <h2 className="form-title">Загрузка файла</h2>
            <Formik
              initialValues={{
                selectedFile: null,
                comment: ''
              }}
              validate={(values) => { }}
              onSubmit={(values, { resetForm }) => handleSubmit(dispatch, values, resetForm, currentPage, file)}
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
    )
  );
}
