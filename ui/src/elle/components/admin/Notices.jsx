import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Delete, DragIndicator, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { successEmitter } from '../../../App';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import RootContext from '../../context/RootContext';
import {
  useCreateNotice,
  useDeleteNotice,
  useGetNotices,
  useReorderNotices,
  useUpdateNotice
} from '../../hooks/service/AdminNoticeService';
import { formatDate, formatOptionalDate } from '../../util/DateUtils';
import { toTranslateTransform } from '../../util/DndUtils';
import ConfirmationModal from '../modal/ConfirmationModal';
import { getNoticeStatus, NoticeStatusChipColor, toAlertSeverity } from '../notice/NoticeConstants';
import { buildNoticePages, getNoticePageLabel, mapPagesByKey } from '../notice/NoticePages';
import { SuccessSnackbarEventType } from '../snackbar/SuccessSnackbar';
import NoticeFormModal from './NoticeFormModal';

function SortableNoticeRow({ notice, index, pagesByKey, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: notice.id });
  const status = getNoticeStatus(notice);

  return (
    <TableRow
      ref={setNodeRef}
      sx={{
        transform: toTranslateTransform(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 1 : 'auto',
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        verticalAlign: 'top'
      }}
    >
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          sx={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          aria-label={t('admin_notices.table.drag_to_reorder')}
          {...attributes}
          {...listeners}
        >
          <DragIndicator fontSize="small" />
        </IconButton>
        {index + 1}
      </TableCell>
      <TableCell sx={{ minWidth: 280 }}>
        <Alert severity={toAlertSeverity(notice.severity)} sx={{ whiteSpace: 'pre-line', mb: 1, py: 0 }}>
          <b>ET:</b> {notice.contentEt}
        </Alert>
        <Alert severity={toAlertSeverity(notice.severity)} sx={{ whiteSpace: 'pre-line', py: 0 }}>
          <b>EN:</b> {notice.contentEn}
        </Alert>
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          color={NoticeStatusChipColor[status]}
          label={t(`admin_notices.status.${status.toLowerCase()}`)}
        />
      </TableCell>
      <TableCell>{t(`admin_notices.severity.${notice.severity.toLowerCase()}`)}</TableCell>
      <TableCell sx={{ minWidth: 160 }}>
        {notice.pages.length
          ? (
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.5}>
              {notice.pages.map(key => (
                <Chip
                  key={key}
                  size="small"
                  variant="outlined"
                  color={pagesByKey.has(key) ? 'default' : 'warning'}
                  label={getNoticePageLabel(key, pagesByKey, t)}
                />
              ))}
            </Stack>
          )
          : t('admin_notices.pages.all_pages')}
      </TableCell>
      <TableCell>{t(notice.dismissible ? 'common_yes' : 'common_no')}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {formatOptionalDate(notice.validFrom)}
        <br />
        {formatOptionalDate(notice.validTo)}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {formatDate(notice.createdAt)}
        <br />
        {formatDate(notice.updatedAt)}
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip title={t('common_edit')}>
          <IconButton size="small" onClick={() => onEdit(notice)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('common_delete')}>
          <IconButton size="small" color="error" onClick={() => onDelete(notice)}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default function Notices({ getAppRoutes }) {
  const { t } = useTranslation();
  const { getNotices } = useGetNotices();
  const { createNotice } = useCreateNotice();
  const { updateNotice } = useUpdateNotice();
  const { deleteNotice } = useDeleteNotice();
  const { reorderNotices } = useReorderNotices();
  const { refreshNotices } = useContext(RootContext);

  const [notices, setNotices] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editedNotice, setEditedNotice] = useState(null);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const pages = useMemo(() => buildNoticePages(getAppRoutes()), [getAppRoutes]);
  const pagesByKey = useMemo(() => mapPagesByKey(pages), [pages]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadNotices = useCallback(() => {
    getNotices().then(data => setNotices(data ?? []));
  }, [getNotices]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const openForm = (notice = null) => {
    setEditedNotice(notice);
    setIsFormOpen(true);
  };

  const handleSubmit = (request) => {
    const save = editedNotice
      ? updateNotice(editedNotice.id, request)
      : createNotice(request);

    save.then(result => {
      if (result) {
        setIsFormOpen(false);
        successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
        loadNotices();
        refreshNotices();
      }
    });
  };

  const handleDelete = () => {
    const id = noticeToDelete.id;
    setNoticeToDelete(null);
    deleteNotice(id).then(res => {
      if (res?.ok) {
        successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
        refreshNotices();
      }
      loadNotices();
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = notices.findIndex(notice => notice.id === active.id);
    const newIndex = notices.findIndex(notice => notice.id === over.id);
    const reordered = arrayMove(notices, oldIndex, newIndex);
    setNotices(reordered);

    reorderNotices(reordered.map(notice => notice.id)).then(result => {
      if (result) {
        setNotices(result);
        successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
        refreshNotices();
      } else {
        loadNotices();
      }
    });
  };

  if (!notices) return null;

  return (
    <>
      <h2 className="text-center pb-3">
        {t('admin_notices.title')}
      </h2>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('admin_notices.description')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" sx={DefaultButtonStyle} onClick={() => openForm()}>
          {t('admin_notices.add')}
        </Button>
      </Box>

      {notices.length === 0 ? (
        <Typography color="text.secondary">{t('admin_notices.empty')}</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>{t('admin_notices.table.order')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.table.content')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.table.status')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.severity.label')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.pages.label')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.table.dismissible')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.table.validity')}</strong></TableCell>
                  <TableCell><strong>{t('admin_notices.table.created_updated')}</strong></TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                <SortableContext items={notices.map(notice => notice.id)} strategy={verticalListSortingStrategy}>
                  {notices.map((notice, index) => (
                    <SortableNoticeRow
                      key={notice.id}
                      notice={notice}
                      index={index}
                      pagesByKey={pagesByKey}
                      onEdit={openForm}
                      onDelete={setNoticeToDelete}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </TableContainer>
      )}

      <NoticeFormModal
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        notice={editedNotice}
        pages={pages}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        isOpen={!!noticeToDelete}
        setIsOpen={(open) => !open && setNoticeToDelete(null)}
        title="admin_notices.delete.title"
        message={t('admin_notices.delete.message')}
        onCancel={() => setNoticeToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
