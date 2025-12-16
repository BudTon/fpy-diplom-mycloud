import { hiddenStoragePage, hiddenUserAdminPage } from '../../../../redux/slices/menuSlice';
import { invisibleRegistrationForm } from '../../../../redux/slices/formSlice';
import { logout } from "../../../../redux/slices/menuRegSlice";

export default function handleCancel(dispatch, navigate) {
    dispatch(invisibleRegistrationForm());
    dispatch(logout());
    dispatch(hiddenStoragePage());
    dispatch(hiddenUserAdminPage());
    navigate('/');
    location.reload(true);
};
