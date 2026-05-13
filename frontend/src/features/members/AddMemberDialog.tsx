import { useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
  initialData?: Partial<MemberFormData>;
  mode?: 'add' | 'edit';
}

export interface MemberFormData {
  displayName: string;
  phone: string;
  type: 'fixed' | 'guest';
  initialBalance: number;
}

const EMPTY_FORM: MemberFormData = {
  displayName: '',
  phone: '',
  type: 'fixed',
  initialBalance: 0,
};

export const AddMemberDialog: FC<AddMemberDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  mode = 'add',
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState<MemberFormData>({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  const handleChange = (field: keyof MemberFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'initialBalance' ? Number(e.target.value) : e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};
    if (!form.displayName.trim()) newErrors.displayName = 'Vui lòng nhập họ tên.';
    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm({ ...EMPTY_FORM, ...initialData });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h5">
          {mode === 'add' ? 'Thêm thành viên mới' : 'Sửa thông tin thành viên'}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 36, minHeight: 36, p: 0.5, color: 'text.secondary' }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Họ và tên *"
            placeholder="Nguyễn Văn An"
            value={form.displayName}
            onChange={handleChange('displayName')}
            error={!!errors.displayName}
            helperText={errors.displayName}
            autoFocus
          />
          <TextField
            label="Loại thành viên"
            select
            value={form.type}
            onChange={handleChange('type')}
          >
            <MenuItem value="fixed">Cố định</MenuItem>
            <MenuItem value="guest">Vãng lai</MenuItem>
          </TextField>
          <TextField
            label="Số điện thoại *"
            placeholder="0912 345 678"
            value={form.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            slotProps={{ htmlInput: { maxLength: 12 } }}
          />
          <TextField
            label="Số dư ban đầu"
            type="number"
            value={form.initialBalance}
            onChange={handleChange('initialBalance')}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> },
            }}
            helperText="Nhập số âm nếu thành viên đang nợ tiền"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ flex: 1, minHeight: 48, borderColor: 'divider', color: 'text.secondary' }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ flex: 1, minHeight: 48 }}
        >
          {mode === 'add' ? 'Thêm thành viên' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
