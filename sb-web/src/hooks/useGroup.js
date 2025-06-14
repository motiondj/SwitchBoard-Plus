import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../store/slices/groupsSlice';
import { showToast } from '../store/slices/uiSlice';

export const useGroup = () => {
  const dispatch = useDispatch();
  const { items: groups, status, error } = useSelector((state) => state.groups);
  const { items: clients } = useSelector((state) => state.clients);

  const loadGroups = useCallback(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCreateGroup = useCallback(async (groupData) => {
    try {
      await dispatch(createGroup(groupData)).unwrap();
      dispatch(showToast({ message: '그룹이 생성되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '그룹 생성에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleUpdateGroup = useCallback(async (id, groupData) => {
    try {
      await dispatch(updateGroup({ id, groupData })).unwrap();
      dispatch(showToast({ message: '그룹이 수정되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '그룹 수정에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleDeleteGroup = useCallback(async (id) => {
    try {
      await dispatch(deleteGroup(id)).unwrap();
      dispatch(showToast({ message: '그룹이 삭제되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '그룹 삭제에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const getGroupClients = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    return clients.filter(client => group.clients.includes(client.id));
  }, [groups, clients]);

  return {
    groups,
    status,
    error,
    loadGroups,
    createGroup: handleCreateGroup,
    updateGroup: handleUpdateGroup,
    deleteGroup: handleDeleteGroup,
    getGroupClients,
  };
}; 