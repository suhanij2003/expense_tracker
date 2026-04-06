// import { useState, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Tooltip,
//   Paper,
//   Chip,
//   Rating,
//   Avatar,
//   InputAdornment,
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Search as SearchIcon,
//   Image as ImageIcon,
// } from '@mui/icons-material';
// import { useData } from '../context/DataContext';
// import { useSnackbar } from '../context/SnackbarContext';
// import SearchBar from '../components/SearchBar';
// import Pagination from '../components/Pagination';

// const Products = () => {
//   const { products, addProduct, updateProduct, deleteProduct, loading } = useData();
//   const { showSuccess, showError } = useSnackbar();
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  
//   const [newProduct, setNewProduct] = useState({
//     title: '',
//     description: '',
//     price: '',
//     category: '',
//     brand: '',
//     thumbnail: '',
//   });

//   const categories = useMemo(() => {
//     const cats = [...new Set(products.map(p => p.category))];
//     return cats.sort();
//   }, [products]);

//   const filteredProducts = useMemo(() => {
//     let result = [...products];
    
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase();
//       result = result.filter(
//         (p) =>
//           p.title?.toLowerCase().includes(search) ||
//           p.description?.toLowerCase().includes(search) ||
//           p.category?.toLowerCase().includes(search) ||
//           p.brand?.toLowerCase().includes(search)
//       );
//     }
    
//     if (categoryFilter) {
//       result = result.filter((p) => p.category === categoryFilter);
//     }
    
//     result.sort((a, b) => {
//       let aValue = a[sortConfig.key] || '';
//       let bValue = b[sortConfig.key] || '';
      
//       if (sortConfig.key === 'price' || sortConfig.key === 'rating') {
//         aValue = Number(aValue);
//         bValue = Number(bValue);
//       }
      
//       if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//       return 0;
//     });
    
//     return result;
//   }, [products, searchTerm, categoryFilter, sortConfig]);

//   const paginatedProducts = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredProducts.slice(start, start + rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const handleSort = (key) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
//     }));
//   };

//   const handleAddClick = () => {
//     setNewProduct({
//       title: '',
//       description: '',
//       price: '',
//       category: '',
//       brand: '',
//       thumbnail: '',
//     });
//     setAddDialogOpen(true);
//   };

//   const handleAddSave = async () => {
//     const result = await addProduct({
//       ...newProduct,
//       price: Number(newProduct.price),
//       rating: 4,
//     });
    
//     if (result.success) {
//       showSuccess('Product added successfully');
//       setAddDialogOpen(false);
//     } else {
//       showError(result.message);
//     }
//   };

//   const handleEditClick = (product) => {
//     setSelectedProduct(product);
//     setEditDialogOpen(true);
//   };

//   const handleEditSave = async () => {
//     const result = await updateProduct(selectedProduct.id, selectedProduct);
    
//     if (result.success) {
//       showSuccess('Product updated successfully');
//       setEditDialogOpen(false);
//       setSelectedProduct(null);
//     } else {
//       showError(result.message);
//     }
//   };

//   const handleDeleteClick = (product) => {
//     setSelectedProduct(product);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     const result = await deleteProduct(selectedProduct.id);
    
//     if (result.success) {
//       showSuccess('Product deleted successfully');
//       setDeleteDialogOpen(false);
//       setSelectedProduct(null);
//     } else {
//       showError(result.message);
//     }
//   };

//   const SortableHeader = ({ label, sortKey }) => (
//     <TableCell
//       onClick={() => handleSort(sortKey)}
//       sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { bgcolor: 'action.hover' } }}
//     >
//       {label}
//       {sortConfig.key === sortKey && (
//         <span style={{ marginLeft: 4 }}>
//           {sortConfig.direction === 'asc' ? '↑' : '↓'}
//         </span>
//       )}
//     </TableCell>
//   );

//   return (
//     <Box>
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Products
//         </Typography>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
//           Add Product
//         </Button>
//       </Box>

//       <Card sx={{ mb: 3, p: 2 }}>
//         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
//           <SearchBar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             placeholder="Search products..."
//           />
//           <TextField
//             select
//             size="small"
//             label="Category"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             sx={{ minWidth: 150 }}
//             SelectProps={{ native: true }}
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </TextField>
//         </Box>
//       </Card>

//       <Card>
//         <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
//                 <SortableHeader label="Title" sortKey="title" />
//                 <SortableHeader label="Category" sortKey="category" />
//                 <SortableHeader label="Brand" sortKey="brand" />
//                 <SortableHeader label="Price" sortKey="price" />
//                 <SortableHeader label="Rating" sortKey="rating" />
//                 <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                     Loading products...
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedProducts.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                     No products found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedProducts.map((product) => (
//                   <TableRow key={product.id} hover>
//                     <TableCell>
//                       <Avatar
//                         variant="rounded"
//                         src={product.thumbnail}
//                         sx={{ width: 50, height: 50, bgcolor: 'grey.200' }}
//                       >
//                         <ImageIcon />
//                       </Avatar>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {product.title}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip label={product.category} size="small" variant="outlined" />
//                     </TableCell>
//                     <TableCell>{product.brand || '-'}</TableCell>
//                     <TableCell>${product.price}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Rating value={product.rating || 0} readOnly size="small" />
//                         <Typography variant="caption">({product.rating || 0})</Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 0.5 }}>
//                         <Tooltip title="Edit">
//                           <IconButton size="small" onClick={() => handleEditClick(product)}>
//                             <EditIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <IconButton size="small" color="error" onClick={() => handleDeleteClick(product)}>
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Pagination
//           count={Math.ceil(filteredProducts.length / rowsPerPage)}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(Number(e.target.value));
//             setPage(1);
//           }}
//         />
//       </Card>

//       {/* Add Dialog */}
//       <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Add New Product</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
//             <TextField
//               label="Title"
//               value={newProduct.title}
//               onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
//               fullWidth
//               required
//             />
//             <TextField
//               label="Description"
//               value={newProduct.description}
//               onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//               fullWidth
//               multiline
//               rows={3}
//             />
//             <TextField
//               label="Price"
//               type="number"
//               value={newProduct.price}
//               onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//               fullWidth
//               required
//               InputProps={{
//                 startAdornment: <InputAdornment position="start">$</InputAdornment>,
//               }}
//             />
//             <TextField
//               label="Category"
//               value={newProduct.category}
//               onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Brand"
//               value={newProduct.brand}
//               onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleAddSave} variant="contained" disabled={!newProduct.title || !newProduct.price}>
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Product</DialogTitle>
//         <DialogContent>
//           {selectedProduct && (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
//               <TextField
//                 label="Title"
//                 value={selectedProduct.title}
//                 onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
//                 fullWidth
//               />
//               <TextField
//                 label="Description"
//                 value={selectedProduct.description}
//                 onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
//                 fullWidth
//                 multiline
//                 rows={3}
//               />
//               <TextField
//                 label="Price"
//                 type="number"
//                 value={selectedProduct.price}
//                 onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
//                 fullWidth
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                 }}
//               />
//               <TextField
//                 label="Category"
//                 value={selectedProduct.category}
//                 onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
//                 fullWidth
//               />
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleEditSave} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>Delete Product</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDeleteConfirm} variant="contained" color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Products;

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Paper,
  Chip,
  Rating,
  Avatar,
  InputAdornment,
  Skeleton,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useData } from '../context/DataContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useData();
  // Removed unused Snackbar context
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' }); // price range filter
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    thumbnail: '',
  });

  // Extract unique categories for the dropdown
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))].filter(Boolean);
    return cats.sort();
  }, [products]);

  // Filtering and Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.category?.toLowerCase().includes(search)
      );
    }
    
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Apply price range filter if set
    if (priceFilter.min !== '' || priceFilter.max !== '') {
      result = result.filter((p) => {
        const price = Number(p.price);
        const minOk = priceFilter.min === '' || price >= Number(priceFilter.min);
        const maxOk = priceFilter.max === '' || price <= Number(priceFilter.max);
        return minOk && maxOk;
      });
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';
      
      if (sortConfig.key === 'price' || sortConfig.key === 'rating') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [products, searchTerm, categoryFilter, priceFilter, sortConfig]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Dialog Handlers
  const handleAddClick = () => {
    setNewProduct({ title: '', description: '', price: '', category: '', brand: '', thumbnail: '' });
    setAddDialogOpen(true);
  };

  const handleAddSave = async () => {
    const result = await addProduct({ ...newProduct, price: Number(newProduct.price), rating: 4 });
    if (result.success) {
      toast.success('Product added successfully');
      setAddDialogOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const result = await updateProduct(selectedProduct.id, selectedProduct);
    if (result.success) {
      toast.success('Product updated successfully');
      setEditDialogOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteProduct(selectedProduct.id);
    if (result.success) {
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const SortableHeader = ({ label, sortKey }) => (
    <TableCell
      onClick={() => handleSort(sortKey)}
      sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { bgcolor: 'action.hover' } }}
    >
      {label}
      {sortConfig.key === sortKey && (
        <span style={{ marginLeft: 4 }}>
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </TableCell>
  );

  // Helper to render skeleton rows
  const renderTableSkeleton = () => {
    return [...Array(rowsPerPage)].map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} /></TableCell>
        <TableCell><Skeleton variant="text" width="80%" /></TableCell>
        <TableCell><Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 4 }} /></TableCell>
        <TableCell><Skeleton variant="text" width={60} /></TableCell>
        <TableCell><Skeleton variant="text" width={40} /></TableCell>
        <TableCell><Skeleton variant="rectangular" width={100} height={20} /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {loading ? (
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
        ) : (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Product
          </Button>
        )}
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width={250} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search products..."
              />
              <TextField
                select
                size="small"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 180 }}
                // FIXED: InputLabelProps shrink and using MenuItem fixes the overlap issue
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              {/* Price range filter */}
              <TextField
                size="small"
                label="Min Price"
                type="number"
                value={priceFilter.min}
                onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                sx={{ width: 100 }}
              />
              <TextField
                size="small"
                label="Max Price"
                type="number"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                sx={{ width: 100 }}
              />
            </>
          )}
        </Box>
      </Card>

      {/* Table Section */}
      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <SortableHeader label="Title" sortKey="title" />
                <SortableHeader label="Category" sortKey="category" />
                <SortableHeader label="Brand" sortKey="brand" />
                <SortableHeader label="Price" sortKey="price" />
                <SortableHeader label="Rating" sortKey="rating" />
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderTableSkeleton()
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={product.thumbnail}
                        sx={{ width: 50, height: 50, bgcolor: 'grey.200' }}
                      >
                        <ImageIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{product.brand || '-'}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={product.rating || 0} readOnly size="small" />
                        <Typography variant="caption">({product.rating || 0})</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEditClick(product)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(product)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredProducts.length / rowsPerPage)}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        />
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              fullWidth
              required
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
            <TextField
              label="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Brand"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained" disabled={!newProduct.title || !newProduct.price}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Title"
                value={selectedProduct.title}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Price"
                type="number"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField
                label="Category"
                value={selectedProduct.category}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;