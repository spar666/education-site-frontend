import { Modal } from 'antd';

type DeleteModal = {
  isVisible: boolean;
  handleSubmit: () => void;
  handleCancel: () => void;
  title?: string;
};
const DeleteModal = ({
  isVisible,
  handleSubmit,
  handleCancel,
  title = 'Are you sure you want to delete this?',
}: DeleteModal) => {
  return (
    <Modal
      title={title}
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Delete"
    />
  );
};

export default DeleteModal;
