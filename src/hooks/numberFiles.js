export default function numberFiles(count) {
  let remains = count % 10;

  if (remains === 1) {
    return "файл";
  };

  if ([2, 3, 4].includes(remains)) {
    return "файла";
  };
  
  return "файлов";
};
