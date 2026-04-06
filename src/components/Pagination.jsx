import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  Typography, 
  IconButton, 
  Paper,
  Tooltip
} from '@mui/material';
import { 
  ChevronLeft as LeftIcon, 
  ChevronRight as RightIcon,
} from '@mui/icons-material';

const Pagination = ({ 
  count, 
  page, 
  onPageChange, 
  rowsPerPage, 
  onRowsPerPageChange, 
  rowsPerPageOptions = [5, 10, 25, 50] 
}) => {
  // Generate a list of pages to show (handles ellipses if too many)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (count <= maxVisible) {
      for (let i = 1; i <= count; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(count, start + maxVisible - 1);
      
      if (end === count) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3,
        mt: 4,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Previous">
          <IconButton 
            size="small" 
            disabled={page === 1}
            onClick={(e) => onPageChange(e, page - 1)}
            sx={{ mr: 1, bgcolor: 'action.hover' }}
          >
            <LeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {pages.map((p, index) => {
            const isActive = p === page;
            
            return (
              <Paper
                key={p}
                elevation={isActive ? 8 : 1}
                onClick={(e) => onPageChange(e, p)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isActive ? 48 : 38,
                  height: isActive ? 48 : 38,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  fontSize: isActive ? '1.1rem' : '0.9rem',
                  fontWeight: isActive ? 800 : 600,
                  bgcolor: isActive ? 'primary.main' : 'background.paper',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isActive ? 10 : 5 - Math.abs(index - pages.indexOf(page)),
                  ml: index === 0 ? 0 : -1.5,
                  boxShadow: isActive 
                    ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.1)',
                    zIndex: 20,
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    color: isActive ? 'primary.contrastText' : 'primary.main',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                {p}
              </Paper>
            );
          })}
        </Box>

        <Tooltip title="Next">
          <IconButton 
            size="small" 
            disabled={page === count}
            onClick={(e) => onPageChange(e, page + 1)}
            sx={{ ml: 2, bgcolor: 'action.hover' }}
          >
            <RightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Pagination;
