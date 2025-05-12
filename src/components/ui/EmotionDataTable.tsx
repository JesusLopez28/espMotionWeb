import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import type { EmotionRecord } from '../../types/emotion-data';
import { format, parseISO } from 'date-fns';

interface EmotionDataTableProps {
  records: EmotionRecord[];
}

const EmotionDataTable: React.FC<EmotionDataTableProps> = ({ records }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterEmotion, setFilterEmotion] = React.useState<string>('');

  // Filtrar registros
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      searchTerm === '' || record.emotion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmotion = filterEmotion === '' || record.emotion === filterEmotion;

    return matchesSearch && matchesEmotion;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: '#FFD700',
      sad: '#4169E1',
      fear: '#9370DB',
      neutral: '#A9A9A9',
      angry: '#FF6347',
      disgust: '#20B2AA',
      surprise: '#FF8C00',
    };

    return colors[emotion] || '#888888';
  };

  // Agregar campo de búsqueda y filtro por emoción
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Controles de filtrado */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Emoción</InputLabel>
          <Select
            value={filterEmotion}
            label="Emoción"
            onChange={e => setFilterEmotion(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="happy">Feliz</MenuItem>
            <MenuItem value="sad">Triste</MenuItem>
            <MenuItem value="fear">Miedo</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="angry">Enojo</MenuItem>
            <MenuItem value="disgust">Disgusto</MenuItem>
            <MenuItem value="surprise">Sorpresa</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabla existente */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Emoción</TableCell>
              <TableCell align="right">BPM</TableCell>
              <TableCell align="right">Sudoración</TableCell>
              <TableCell align="right">Confianza</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell>{format(parseISO(row.date), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.emotion}
                      size="small"
                      sx={{
                        backgroundColor: getEmotionColor(row.emotion),
                        color: ['happy', 'surprise'].includes(row.emotion) ? 'black' : 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{row.bpm.toFixed(1)}</TableCell>
                  <TableCell align="right">{row.sweating.toFixed(3)}</TableCell>
                  <TableCell align="right">{(row.confidence).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredRecords.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EmotionDataTable;
