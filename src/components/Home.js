import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CssBaseline,
  Grid,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

function Home() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productPrice);
    formData.append("image", productImage);

    try {
      const response = await axios.post(
        "https://hostapi-production-15e5.up.railway.app/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setSuccessMessage("Product listed successfully!");
      // Clear form fields
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImage(null);
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              List Your Product
            </Typography>
            {successMessage && (
              <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                {successMessage}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="productName"
                    label="Product Name"
                    name="productName"
                    autoComplete="off"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="productDescription"
                    label="Product Description"
                    name="productDescription"
                    autoComplete="off"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="productPrice"
                    label="Product Price"
                    name="productPrice"
                    type="number"
                    autoComplete="off"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setProductImage(e.target.files[0])}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Home;
