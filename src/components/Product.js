import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  CssBaseline,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme();

function Product() {
  const [products, setProducts] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://hostapi-production-15e5.up.railway.app/api/products"
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://hostapi-production-15e5.up.railway.app/api/products/${id}`
      );
      fetchProducts(); // Refresh products after deletion
      setSuccessMessage("Product deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setUpdatedProduct({
      ...product,
      image: null, // Reset image to null for editing
    });
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("description", updatedProduct.description);
    formData.append("price", updatedProduct.price);
    if (updatedProduct.image) {
      formData.append("image", updatedProduct.image);
    }

    try {
      await axios.post(
        `https://hostapi-production-15e5.up.railway.app/api/products/${editProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchProducts(); // Refresh products after update
      setOpenEditDialog(false);
      setSuccessMessage("Product updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response && error.response.data) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main">
        <Box sx={{ marginTop: 8 }}>
          <Typography component="h1" variant="h5">
            Product List
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>{product.description}</Typography>
                  <img
                    src={product.image}
                    style={{ height: "300px", width: "300px" }}
                    alt={product.name}
                  />
                  <Typography>${product.price}</Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            value={updatedProduct.name}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Product Description"
            fullWidth
            value={updatedProduct.description}
            onChange={(e) =>
              setUpdatedProduct({
                ...updatedProduct,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Product Price"
            fullWidth
            type="number"
            value={updatedProduct.price}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, price: e.target.value })
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink htmlFor="product-image">
              Product Image
            </InputLabel>
            <input
              accept="image/*"
              id="product-image"
              type="file"
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  image: e.target.files[0],
                })
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Product;
