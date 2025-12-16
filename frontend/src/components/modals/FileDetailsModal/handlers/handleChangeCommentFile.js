import { fetchFileChangeComment } from '../../../../fetch/fetchFileChangeComment';
import { fetchFileUser } from '../../../../fetch/fetchFileUser';
import { showToast } from '../../../../hooks/showToast';

export function handleChangeCommentFile({ file, token, userId, dispatch, page }) {
  const { id } = file;

  let result = prompt("Введите новый комментарий:");
  if (result) {
    let newComment = result;
    dispatch(fetchFileChangeComment({ fileId: id, newComment, token }))
      .then(() => {
        showToast('toast', "Комментарий изменился");
        setTimeout(() => dispatch(fetchFileUser({ userId, page })), 3000);
      })
      .catch(error => {
        showToast('toast', "Ошибка при изменении комментария");
        console.error("Ошибка при изменении комментария:", error);
      });
  } else {
    showToast('toast', "Комментарий не поменялся");
    console.log("Комментарий не поменялся");
  }
}
