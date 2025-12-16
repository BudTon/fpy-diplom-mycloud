import { fetchFileUser } from '../../../../fetch/fetchFileUser';
import { fetchFileUploaded } from '../../../../fetch/fetchFileUploaded';


export default function handleSubmit(dispatch, values, resetForm, currentPage, file) {

  dispatch(fetchFileUploaded(values))
    .unwrap()
    .then(() => {
      alert(`Файл отправлен!\nИмя файла: ${values.selectedFile.name}\nКомментарий: ${values.comment ? values.comment : "отсутствует"}`);
      dispatch(fetchFileUser({ userId: file.userId, page: currentPage }));
      resetForm({
        selectedFile: null,
        comment: '',
      });
      document.getElementById('selectedFile').value = '';
    })
    .catch((error) => {
      console.error('Ошибка при отправке файла:', error);
    });
}
