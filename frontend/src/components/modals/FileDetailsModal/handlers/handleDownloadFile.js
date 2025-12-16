import { fetchFileUser } from '../../../../fetch/fetchFileUser';
import { showToast } from '../../../../hooks/showToast';

export function handleDownloadFile({ file, userId, dispatch, page }) {
  const { links } = file;

  window.location.href = links.download;
  showToast('toast', "Файл успешно скачен");
  console.log("Файл успешно скачен");
  setTimeout(() => dispatch(fetchFileUser({ userId, page })), 2000);
}
