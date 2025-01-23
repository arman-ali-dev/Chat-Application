import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  return createPortal(
    <>
      <div className="back-view">
        <div className="modal">
          <button onClick={onClose} className="closeBtn">
            <i className="fa-solid fa-xmark"></i>
          </button>
          {children}
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
};

export default Modal;
