import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {t("form.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          {t("form.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
