import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ open, data, close }) {
  return ReactDOM.createPortal(
    <>
      {open ? (
        <div
          id='demo-modal'
          className={`${open ? 'open' : undefined} modal`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='modal__content'>
            <p>{data}</p>
            <button
              className='modal__close'
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              &times;
            </button>
          </div>
        </div>
      ) : null}
    </>,
    document.getElementById('modal-root'),
  );
}
