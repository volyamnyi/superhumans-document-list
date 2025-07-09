import { useState } from "react";

export default function SuccessModal({ setShowSuccessModal, isSaved }) {
  
  function handleOk() {
    setShowSuccessModal(false);
  }

  return (
    <>
      <div class="modal-overlay">
        <div class="modal">
          <h2>
            Листок призначень успішно {isSaved ? "збережено" : "згенеровано у Доктор Елекс"}!
          </h2>
          <div className="buttons-modal">
            <button type="button" className="cancel-btn" onClick={handleOk}>
              ОК
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
