import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { deleteGroup } from '../../store/slices/groupsSlice';
import { openGroupModal } from '../../store/slices/uiSlice';
import { showToast } from '../../store/slices/uiSlice';
import { useSelector } from 'react-redux';

const GroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.items) || [];
  const groupClients = clients.filter(client => client.groupId === group.id);

  const handleEdit = () => {
    dispatch(openGroupModal(group.id));
  };

  const handleDelete = () => {
    if (window.confirm('이 그룹을 삭제하시겠습니까?')) {
      dispatch(deleteGroup(group.id))
        .unwrap()
        .then(() => {
          dispatch(showToast({
            message: '그룹이 삭제되었습니다.',
            severity: 'success'
          }));
        })
        .catch((error) => {
          dispatch(showToast({
            message: error.message || '그룹 삭제 중 오류가 발생했습니다.',
            severity: 'error'
          }));
        });
    }
  };

  const getClientStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" noWrap>
            {group.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="편집">
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {group.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {group.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {groupClients.map((client) => (
            <Chip
              key={client.id}
              label={client.name}
              size="small"
              color={getClientStatusColor(client.status)}
              sx={{ 
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          편집
        </Button>
      </CardActions>
    </Card>
  );
};

export default GroupCard; 