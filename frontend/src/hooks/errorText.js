export function errorText(errorData) {
  let usernameErrorText = 'Замечаний нет';
  let firstNameErrorText = 'Не проверяется - Замечаний нет';
  let emailErrorText = 'Замечаний нет';
  let passwordErrorText = 'Замечаний нет';

  if (errorData.username) {
    if (Array.isArray(errorData.username)) {
      usernameErrorText = errorData.username[0]
    } else {
      usernameErrorText = errorData.username.detail
    }
  }

  if (errorData.email) {
    if (Array.isArray(errorData.email)) {
      emailErrorText = errorData.email[0]
    } else {
      emailErrorText = errorData.email.detail
    }
  }

  if (errorData.password) {
    if (Array.isArray(errorData.password)) {
      passwordErrorText = errorData.password[0]
    } else {
      passwordErrorText = errorData.password.detail
    }
  }

  const errorText = {
    codeError: true,
    detail: `Логин: ${usernameErrorText},\nПолное имя:  ${firstNameErrorText},\nЭлектронная почта:  ${emailErrorText},\nПароль:  ${passwordErrorText},\n`
  }
  return errorText
}
