export function showToast(toast, message) {
  let toastDiv = document.querySelector(`#${toast}`);
  toastDiv.innerHTML = message;
  toastDiv.style.opacity = 1;
  setTimeout(function () { toastDiv.style.opacity = 0; }, 3000);
}
