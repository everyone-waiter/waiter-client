import React from 'react';
import { SWRConfig } from 'swr';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          toast.error(error.message);
        },
      }}
    >
      <div className="App"></div>;
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
  );
}

export default App;
