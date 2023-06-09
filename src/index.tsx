import App from './App';
import React from 'react';
import { SWRConfig } from 'swr';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 5000,
        onError: (error) => {
          toast.error(error.response.data);

          if (error.response.status === 404) {
            window.location.replace('/notfound');
          }
        },
        errorRetryCount: 0,
      }}
    >
      <App />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </SWRConfig>
  </React.StrictMode>,
);
