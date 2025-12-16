import { showToast } from '../../../../hooks/showToast';

export function openFileInBrowser(fileUrl) {
  window.open(fileUrl, '_blank');
  showToast('toast', "Файл открыт!");
  console.log('Файл открыт!');
}
