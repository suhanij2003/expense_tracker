import { Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

const Filters = ({ filterType, onFilterChange, categories = [], selectedCategory, onCategoryChange, typeOptions = [] }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      {typeOptions.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            label="Filter by Type"
          >
            <MenuItem value="">All</MenuItem>
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      {categories.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      {selectedCategory && (
        <Chip
          label={`Category: ${selectedCategory}`}
          onDelete={() => onCategoryChange('')}
          color="primary"
          variant="outlined"
        />
      )}
      
      {filterType && (
        <Chip
          label={`Type: ${filterType}`}
          onDelete={() => onFilterChange('')}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default Filters;
