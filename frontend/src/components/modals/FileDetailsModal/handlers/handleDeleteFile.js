import { fetchFileDelete } from '../../../../fetch/fetchFileDelete';
import { fetchFileUser } from '../../../../fetch/fetchFileUser';
import { showToast } from '../../../../hooks/showToast';

export function handleDeleteFile({ file, userId, dispatch, page }) {
  const { id } = file;


  dispatch(fetchFileDelete({ fileId: id, userId }))
    .then(() => {
      showToast('toast', "Файл удален");
      setTimeout(() => dispatch(fetchFileUser({ userId, page })), 3000);
    })
    .catch(error => {
      console.error("Ошибка при удалении файла:", error);
    });
}
