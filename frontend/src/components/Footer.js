import React from "react";
import { Box, Typography, IconButton, Divider, Container, Grid } from "@mui/material";
import { Facebook, Twitter, Instagram, Email, Phone, LocationOn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 1, // Aún más delgado
        textAlign: "center",
        width: "100%",
        position: "relative",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          {/* Sección de Contacto */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Contacto
            </Typography>
            <Typography variant="caption" display="flex" alignItems="center" justifyContent="center">
              <Email sx={{ mr: 0.5 }} fontSize="small" /> info@universidad.edu
            </Typography>
            <Typography variant="caption" display="flex" alignItems="center" justifyContent="center">
              <Phone sx={{ mr: 0.5 }} fontSize="small" /> +57 123 456 7890
            </Typography>
          </Grid>

          {/* Sección de Ubicación */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Ubicación
            </Typography>
            <Typography variant="caption" display="flex" alignItems="center" justifyContent="center">
              <LocationOn sx={{ mr: 0.5 }} fontSize="small" /> Calle 123, Ciudad, País
            </Typography>
          </Grid>
        </Grid>

        {/* Divider más delgado */}
        <Divider sx={{ bgcolor: "white", my: 0.5 }} />

        {/* Sección de Redes Sociales */}
        <Typography variant="caption">Síguenos en nuestras redes sociales:</Typography>
        <Box>
          <IconButton href="https://facebook.com" target="_blank" sx={{ color: "white" }} size="small">
            <Facebook fontSize="small" />
          </IconButton>
          <IconButton href="https://twitter.com" target="_blank" sx={{ color: "white" }} size="small">
            <Twitter fontSize="small" />
          </IconButton>
          <IconButton href="https://instagram.com" target="_blank" sx={{ color: "white" }} size="small">
            <Instagram fontSize="small" />
          </IconButton>
        </Box>

        {/* Sección de Copyright */}
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          © {new Date().getFullYear()} Universidad. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
