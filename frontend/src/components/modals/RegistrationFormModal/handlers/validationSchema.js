import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9]{3,19}$/, 'Логин должен начинаться с буквы и содержать только латиницу и цифры.')
    .required('Логин обязателен.'),
  // email: Yup.string()
  //   .email('Некорректный формат email.')
  //   .required('Email обязателен.'),
  // firstname: Yup.string()
  //   .required('Полное имя обязательно.'),
  // password: Yup.string()
  //   .min(6, 'Минимум 6 символов.')
  //   .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$/, 'Пароль должен содержать хотя бы одну заглавную букву, цифру и спецсимвол.')
  //   .required('Пароль обязателен.'),
});
