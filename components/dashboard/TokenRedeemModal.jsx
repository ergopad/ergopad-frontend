import { Box, Modal, Typography, useMediaQuery } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TokenRedeemModal = ({ boxId, onClose }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  return (
    <>
      <Modal
        open={boxId !== null}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Redeem
          </Typography>
          <Typography color="text.secondary">
            You will be able to claim your vested tokens here.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default TokenRedeemModal;
