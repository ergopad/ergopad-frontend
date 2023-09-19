import React, { FC, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import AddNautilus from './AddNautilus';
import AddMobile from './AddMobile';

interface AddWalletProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AddWalletExpanded = 'mobile' | 'nautilus' | undefined

const AddWalletModal: FC<AddWalletProps> = ({ open, setModalOpen, setLoading }) => {
  const [expanded, setExpanded] = useState<AddWalletExpanded>(undefined)
  return (
    <Dialog open={open}>
      <DialogTitle>
        Connect a wallet to continue
      </DialogTitle>
      <DialogContent>
        <Box>
          <AddNautilus
            setModalOpen={setModalOpen}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Box>
        <Box>
          <AddMobile
            setModalOpen={setModalOpen}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setModalOpen(false)
          setExpanded(undefined)
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddWalletModal