import { Formik, Field, Form, ErrorMessage } from "formik";
import { validationSchema } from './handlers/validationSchema'
import handleCheckboxChangeAdmin from './handlers/handleCheckboxChangeAdmin'
import handleCancel from './handlers/handleCancel'
import handleSubmit from './handlers/handleSubmit'

export function RegistrationFormModal({ dispatch, navigate, loading, errorMessage, isCheckedAdmin, isModalRegistrationForm, setIsCheckedAdmin }) {

  return (isModalRegistrationForm && (
    <div className="modal-box-form-reg">
      <div className="modal-form-reg">
        <Formik
          initialValues={{ username: "", firstname: "", email: "", password: "", isStaff: false }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(dispatch, values, isCheckedAdmin)}
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
                    onChange={() => handleCheckboxChangeAdmin(dispatch, isCheckedAdmin, setIsCheckedAdmin)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <button className="button-reg-form-submit" type="submit" disabled={isSubmitting || loading}>Зарегистрироваться</button>
              <button className="button-reg-form-cancel" onClick={() => handleCancel(dispatch, navigate)}>Отмена</button>
              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
  )
}
