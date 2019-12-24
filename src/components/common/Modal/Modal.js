import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styles from "./Modal.less";

const Modals = ({ isopen, modalToggle, btnOnClick, modalTitle, modalBody, submitBtn, color, close }) => (
  <div>
    {/* <Button color="danger" onClick={this.toggle}></Button> */}
    <Modal size={"lg"} isOpen={isopen} toggle={modalToggle}>
      <ModalHeader className={styles.headers}>{modalTitle}
        <i className={`fa fa-times ${styles.closebtn}`} aria-hidden="true" onClick={close} />
      </ModalHeader>
      {/* <ModalBody dangerouslySetInnerHTML={{__html:modalBody}} ></ModalBody> */}
      <ModalBody className={styles.modelBody}>{modalBody}</ModalBody>
      {submitBtn && <ModalFooter>
        <Button color={color} onClick={btnOnClick}>
          {submitBtn}
        </Button>
      </ModalFooter>}
    </Modal>
  </div>
);

export default Modals;
