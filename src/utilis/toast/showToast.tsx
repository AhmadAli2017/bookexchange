import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = (message: any, type: 'success' | 'error') => {
    const toastOptions = {
        autoClose: 2000,
    };

    if (type === 'success') {
        toast.success(message, toastOptions);
    } else {
        toast.error(message, toastOptions);
    }
};

export { showToast, ToastContainer };
