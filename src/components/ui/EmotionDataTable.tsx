import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
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
  useTheme,
  Typography,
  InputAdornment,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { EmotionRecord } from '../../types/emotion-data';
import { format, parseISO } from 'date-fns';
import ScrollableContainer from './ScrollableContainer';

interface EmotionDataTableProps {
  records: EmotionRecord[];
}

const EmotionDataTable: React.FC<EmotionDataTableProps> = ({ records }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterEmotion, setFilterEmotion] = React.useState<string>('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filtrar registros
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      searchTerm === '' || record.emotion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmotion = filterEmotion === '' || record.emotion === filterEmotion;

    return matchesSearch && matchesEmotion;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      happy: { bg: '#FFD700', text: '#000000' },
      sad: { bg: '#4169E1', text: '#FFFFFF' },
      fear: { bg: '#9370DB', text: '#FFFFFF' },
      neutral: { bg: '#A9A9A9', text: '#FFFFFF' },
      angry: { bg: '#FF6347', text: '#FFFFFF' },
      disgust: { bg: '#20B2AA', text: '#FFFFFF' },
      surprise: { bg: '#FF8C00', text: '#000000' },
    };

    return colors[emotion] || { bg: '#888888', text: '#FFFFFF' };
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionIcons: Record<string, React.ReactNode> = {
      happy: '😊',
      sad: '😢',
      fear: '😨',
      neutral: '😐',
      angry: '😠',
      disgust: '🤢',
      surprise: '😲',
    };

    return emotionIcons[emotion] || '';
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      happy: 'Feliz',
      sad: 'Triste',
      fear: 'Miedo',
      neutral: 'Neutral',
      angry: 'Enojo',
      disgust: 'Disgusto',
      surprise: 'Sorpresa',
    };

    return labels[emotion] || emotion;
  };

  // Vista móvil con tarjetas en lugar de tabla
  const renderMobileView = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
          const emotion = getEmotionColor(row.emotion);
          const isExpanded = expandedRow === row.id;

          return (
            <Card
              key={row.id}
              sx={{
                mb: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => setExpandedRow(isExpanded ? null : row.id)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{getEmotionIcon(row.emotion)}</span>
                        <span>{getEmotionLabel(row.emotion)}</span>
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: emotion.bg,
                      color: emotion.text,
                      fontWeight: 500,
                      px: 0.5,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(row.date), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ py: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteOutlinedIcon
                      fontSize="small"
                      sx={{ color: theme.palette.secondary.main }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={row.bpm > 100 ? theme.palette.error.main : 'inherit'}
                    >
                      {row.bpm.toFixed(1)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <OpacityOutlinedIcon
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {row.sweating.toFixed(3)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PercentOutlinedIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={
                        row.confidence > 90
                          ? '#2e7d32'
                          : row.confidence > 75
                            ? '#ff8f00'
                            : '#c62828'
                      }
                    >
                      {row.confidence.toFixed(1)}%
                    </Typography>
                  </Box>
                </Stack>

                {isExpanded && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary">
                      ID: {row.id}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredRecords.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              No se encontraron registros
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros o realizar una nueva búsqueda
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
      elevation={0}
    >
      {/* Título y controles de filtrado */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Registros de Emociones
          <Typography
            component="span"
            variant="body2"
            sx={{
              ml: 1,
              color: 'text.secondary',
              backgroundColor: 'rgba(0,0,0,0.05)',
              px: 1.5,
              py: 0.5,
              borderRadius: 5,
              fontWeight: 500,
              display: { xs: 'none', sm: 'inline-block' },
            }}
          >
            {filteredRecords.length} Registros
          </Typography>
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 150 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel id="emotion-filter-label">
              <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Emoción
            </InputLabel>
            <Select
              labelId="emotion-filter-label"
              value={filterEmotion}
              label="Emoción"
              onChange={e => setFilterEmotion(e.target.value)}
            >
              <MenuItem value="">Todas las emociones</MenuItem>
              <MenuItem value="happy">😊 Feliz</MenuItem>
              <MenuItem value="sad">😢 Triste</MenuItem>
              <MenuItem value="fear">😨 Miedo</MenuItem>
              <MenuItem value="neutral">😐 Neutral</MenuItem>
              <MenuItem value="angry">😠 Enojo</MenuItem>
              <MenuItem value="disgust">🤢 Disgusto</MenuItem>
              <MenuItem value="surprise">😲 Sorpresa</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Vista móvil o desktop según el tamaño de pantalla */}
      {isMobile ? (
        renderMobileView()
      ) : (
        <ScrollableContainer maxHeight="480px">
          <Table stickyHeader aria-label="tabla de emociones">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  Fecha
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  Emoción
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <FavoriteOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: theme.palette.secondary.main }}
                    />
                    BPM
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <OpacityOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: theme.palette.primary.main }}
                    />
                    Sudoración
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <PercentOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: theme.palette.info.main }}
                    />
                    Confianza
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  const emotion = getEmotionColor(row.emotion);
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(82, 113, 255, 0.04) !important',
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {format(parseISO(row.date), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>{getEmotionIcon(row.emotion)}</span>
                              <span>{getEmotionLabel(row.emotion)}</span>
                            </Box>
                          }
                          size="small"
                          sx={{
                            backgroundColor: emotion.bg,
                            color: emotion.text,
                            fontWeight: 500,
                            px: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          color: row.bpm > 100 ? theme.palette.error.main : 'inherit',
                        }}
                      >
                        {row.bpm.toFixed(1)}
                      </TableCell>
                      <TableCell align="right">{row.sweating.toFixed(3)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${row.confidence.toFixed(1)}%`}
                          size="small"
                          sx={{
                            backgroundColor:
                              row.confidence > 90
                                ? 'rgba(102, 187, 106, 0.15)'
                                : row.confidence > 75
                                  ? 'rgba(255, 183, 77, 0.15)'
                                  : 'rgba(239, 83, 80, 0.15)',
                            color:
                              row.confidence > 90
                                ? '#2e7d32'
                                : row.confidence > 75
                                  ? '#ff8f00'
                                  : '#c62828',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

              {filteredRecords.length === 0 && (
                <TableRow style={{ height: 53 * 5 }}>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 5 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        No se encontraron registros
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Intenta ajustar los filtros o realizar una nueva búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollableContainer>
      )}

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredRecords.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? 'Filas:' : 'Filas por página:'}
        labelDisplayedRows={({ from, to, count }) =>
          isMobile ? `${from}-${to} de ${count}` : `${from}-${to} de ${count} registros`
        }
      />
    </Paper>
  );
};

export default EmotionDataTable;
