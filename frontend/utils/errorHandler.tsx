import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function handleError(error: Error | AxiosError, popup: typeof toast) {
  if (error) {
    const axiosError = error as AxiosError; // Cast error to AxiosError
    const responseData = axiosError.response?.data as
      | { errors: string[] }
      | undefined;
    const err = 'Ouch, an error happen!';
    popup.error(err, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  } else {
    console.error(error, 'err');
  }
}

export function handleErrorServerSide(error: AxiosError) {
  const err = error as AxiosError;
  if (err.response?.status === 403) {
    return { props: { error: 'limit' } };
  }

  if (err.response?.status === 404) {
    return { props: { error: 'notfound' } };
  }

  return { props: { error: 'unknown' } };
}
