import { useSelector } from 'react-redux';
import { useState } from 'react';
import { dateTime } from '../../hooks/dateTime';
import { FileDetailsModal } from '../modals/FileDetailsModal/FileDetailsModal';
import './file-property.css';

export default function FileProperty({ file, currentPage, index }) {
  const { file_name, comment, size, created_at, lastDownloadDate,} = file;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useSelector((state) => state.login.results).token;
  const { userId } = useSelector((state) => state.file.results);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileClick = () => {
    setIsModalOpen(true);
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
      <FileDetailsModal
        file={file}
        token={token}
        userId={userId}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        page={currentPage}
      />
    </>
  );
}
