import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { dateTime } from '../../hooks/dateTime';
import { fetchFileDelete } from '../../fetch/fetchFileDelete';
import { fetchFileUser } from '../../fetch/fetchFileUser';
import { fetchFileRename } from '../../fetch/fetchFileRename';
import { showToast } from '../../hooks/showToast';
import './file-property.css';

export default function FileProperty({ file, index }) {
  const dispatch = useDispatch();
  const { id, file_name, comment, size, created_at, lastDownloadDate, type, links } = file
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useSelector((state) => state.file.results);
  const user = useSelector((state) => state.user.results);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileClick = () => {
    setIsModalOpen(true);
  };

  const handleRenameFile = () => {
    let result = prompt("Введите новое имя файла:");
    if (result) {
      let newFileName;
      newFileName = `${result}${/\.[^.]*$/.exec(file_name)[0]}`;
      const fileId = id
      const token = user.token
      dispatch(fetchFileRename({ fileId, newFileName, token }))
        .then(() => {
          showToast('toast', "Имя файла изменилось")
          setTimeout(function () { dispatch(fetchFileUser({ userId })); }, 3000);
        })
        .catch(error => {
          showToast('toast', "Ошибка при изменении имени файла")
          console.error("Ошибка при изменении имени файла:", error);
        });
    } else {
      showToast('toast', "Имя файла не поменялось")
      console.log("Имя файла не поменялось");
    }
  };

  const handleChangeCommentFile = () => {
    let result = prompt("Введите новый комментарий:");
    if (result) {
      let newComment = result;
      const fileId = id
      const token = user.token

      dispatch(fetchFileRename({ fileId, newComment, token }))
        .then(() => {
          showToast('toast', "Комментарий изменился")
          setTimeout(function () { dispatch(fetchFileUser({ userId })); }, 3000);
        })
        .catch(error => {
          showToast('toast', "Ошибка при изменении комментария")
          console.error("Ошибка при изменении комментария:", error);
        });
    } else {
      showToast('toast', "Комментарий не поменялся")
      console.log("Комментарий не поменялся");
    }
  };

  const handleDeleteFile = () => {
    dispatch(fetchFileDelete({ fileId: id, userId }))
      .then(() => {
        showToast('toast', "Файл удален")
        setTimeout(function () { dispatch(fetchFileUser({ userId })); }, 3000);
      })
      .catch(error => {
        console.error("Ошибка при удалении файла:", error);
      });
  };

  const handleDownloadFile = () => {
    window.location.href = links.download
    showToast('toast', "Файл успешно скачен")
    console.log("Файл успешно скачен");
    setTimeout(function () { dispatch(fetchFileUser({ userId })); }, 2000);
  };

  const copyToClipboard = (fileUrl) => {
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
  };

  const openFileInBrowser = (fileUrl) => {
    window.open(fileUrl, '_blank')
    showToast('toast', "Файл открыт!")
    console.log('Файл открыт!');
  };

  return (
    <>
      <tr onClick={handleFileClick}>
        <td>{index}</td>
        <td>{file_name}</td>
        <td>{comment ? comment : "-"}</td>
        <td>{Math.round(size / 1024)} KB</td>
        <td>{created_at ? dateTime(created_at) : "-"}</td>
        <td>{lastDownloadDate ? dateTime(lastDownloadDate) : "-"}</td>
      </tr>
      {isModalOpen && (
        <tr>
          <td>
            <div className="modal-box">
              <div className="modal-file">
                <div id="toast"></div>
                <h2>Детали файла</h2>
                <p>type: {type}</p>
                <p className="rename-button-file" onClick={handleRenameFile}>имя файла: {file_name} 🖊️</p>
                <p className="recomment-button-file" onClick={handleChangeCommentFile}>комментарий: {comment ? comment : "-"} 🖊️</p>
                <p>дата загрузки: {created_at ? dateTime(created_at) : "-"}</p>
                <p>дата последнего скачивания: {lastDownloadDate ? dateTime(lastDownloadDate) : "-"}</p>
                <p>размер: {Math.round(size / 1024)} KB</p>
                <div className="link-btn">
                  <h2>Ссылка на файл:</h2>
                  <button className="copy-button-link" onClick={() => copyToClipboard(links.download)}>{links ? `Копировать 🔗` : "-"}</button>
                  <button className="open-button-link" onClick={() => openFileInBrowser(links.view)}>{links ? `Открыть файл  📄 ` : "-"}</button>
                  <p> {links ? links.view : "-"}</p>
                </div>
                <div className="btn-all">
                  <button className="delete-button-file" onClick={handleDeleteFile}>Удалить</button>
                  <button className="download-button-file" onClick={handleDownloadFile}>Скачать</button>
                  <button className="close-button-file" onClick={handleCloseModal}>Отмена</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
