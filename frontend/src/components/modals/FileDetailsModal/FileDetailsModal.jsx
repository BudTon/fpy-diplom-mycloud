import { useDispatch } from 'react-redux';
import { dateTime } from '../../../hooks/dateTime';
import { handleRenameFile } from './handlers/handleRenameFile';
import { handleChangeCommentFile } from './handlers/handleChangeCommentFile';
import { handleDeleteFile } from './handlers/handleDeleteFile';
import { handleDownloadFile } from './handlers/handleDownloadFile';
import { copyToClipboard } from './handlers/copyToClipboard';
import { openFileInBrowser } from './handlers/openFileInBrowser';

export function FileDetailsModal({ file, token, userId, isModalOpen, handleCloseModal, page }) {
  const dispatch = useDispatch();
  const { file_name, comment, size, created_at, lastDownloadDate, type, links } = file;

  return (
    <>
      {isModalOpen && (
        <tr>
          <td>
            <div className="modal-box">
              <div className="modal-file">
                <div id="toast"></div>
                <h2>Детали файла</h2>
                <p>type: {type}</p>
                <p className="rename-button-file" onClick={() => handleRenameFile({ file, token, userId, dispatch, page })}>имя файла: {file_name} 🖊️</p>
                <p className="recomment-button-file" onClick={() => handleChangeCommentFile({ file, token, userId, dispatch, page })}>комментарий: {comment ? comment : "-"} 🖊️</p>
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
                  <button className="delete-button-file" onClick={() => handleDeleteFile({ file, userId, dispatch, page })}>Удалить</button>
                  <button className="download-button-file" onClick={() => handleDownloadFile({ file, userId, dispatch, page })}>Скачать</button>
                  <button className="close-button-file" onClick={handleCloseModal}>Отмена</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
