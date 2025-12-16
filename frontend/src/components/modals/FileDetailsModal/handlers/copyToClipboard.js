import { showToast } from '../../../../hooks/showToast';

export function copyToClipboard(fileUrl) {
  const textArea = document.createElement("textarea");
  textArea.value = fileUrl;
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showToast('toast', "Ссылка скопирована!");
  console.log('Ссылка скопирована!');
}
