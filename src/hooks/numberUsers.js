export default function numberUsers(count) {
  let remains = count % 100;
  if (remains >= 11 && remains <= 19) {
    return "пользователей";
  };
  remains %= 10;
  if (remains === 1) {
    return "пользователь";
  };
  if ([2, 3, 4].includes(remains)) {
    return "пользователя";
  };
  return "пользователей";
};
