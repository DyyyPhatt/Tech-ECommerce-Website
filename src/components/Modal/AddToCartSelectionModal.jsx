import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

const AddToCartSelectionModal = ({
  show,
  onClose,
  product,
  selectedColor,
  setSelectedColor,
  selectedQuantity,
  setSelectedQuantity,
  handleConfirmAddToCart,
}) => {
  const selectedColorQuantity =
    product.colors.find((color) => color.name === selectedColor)?.quantity || 0;

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (quantity > 0 && quantity <= selectedColorQuantity)
      setSelectedQuantity(quantity);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaShoppingCart className="icon" /> Thêm vào giỏ hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicColor">
            <Form.Label>Chọn Màu Sắc</Form.Label>
            <Form.Control
              as="select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {product.colors.map((color) => (
                <option key={color.name} value={color.name}>
                  {color.name} - {color.quantity} sản phẩm hiện có
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicQuantity">
            <Form.Label>Chọn Số Lượng</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              max={selectedColorQuantity}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirmAddToCart}
          disabled={selectedColorQuantity === 0}
        >
          {selectedColorQuantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToCartSelectionModal;
