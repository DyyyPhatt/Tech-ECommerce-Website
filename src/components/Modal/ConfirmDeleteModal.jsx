import React from "react";
import "./Modal.css";
import { Modal, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const ConfirmDeleteModal = ({ show, product, onConfirm, onCancel }) => {
  return (
    <Modal className="confirm-delete-modal" show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaTrash className="icon" /> Xác nhận xóa
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa <strong>{product?.title}</strong> khỏi giỏ
        hàng không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
