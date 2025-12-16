import { fetchFileRename } from '../../../../fetch/fetchFileRename';
import { fetchFileUser } from '../../../../fetch/fetchFileUser';
import { showToast } from '../../../../hooks/showToast';

export function handleRenameFile({ file, token, userId, dispatch, page }) {
  const { id, file_name } = file;

  let result = prompt("Введите новое имя файла:");
  if (result) {
    let newFileName = `${result}${/\.[^.]*$/.exec(file_name)[0]}`;
    dispatch(fetchFileRename({ fileId: id, newFileName, token }))
      .then(() => {
        showToast('toast', "Имя файла изменилось");
        setTimeout(() => dispatch(fetchFileUser({ userId, page })), 3000);
      })
      .catch(error => {
        showToast('toast', "Ошибка при изменении имени файла");
        console.error("Ошибка при изменении имени файла:", error);
      });
  } else {
    showToast('toast', "Имя файла не поменялось");
    console.log("Имя файла не поменялось");
  }
}
