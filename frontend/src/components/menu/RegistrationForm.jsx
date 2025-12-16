import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationFormModal } from '../modals/RegistrationFormModal/RegistrationFormModal'

import './register-form.css'

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errorMessage } = useSelector((state) => state.login);
  const isModalRegistrationForm = useSelector((state) => state.form.isModalRegistrationForm);
  const [isCheckedAdmin, setIsCheckedAdmin] = useState(false);

  return (
    <RegistrationFormModal
      dispatch={dispatch}
      navigate={navigate}
      loading={loading}
      errorMessage={errorMessage}
      isModalRegistrationForm={isModalRegistrationForm}
      isCheckedAdmin={isCheckedAdmin}
      setIsCheckedAdmin={setIsCheckedAdmin}
    />
  );
};
