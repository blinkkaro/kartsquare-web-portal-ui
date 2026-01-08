"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/features/ui/uiSlice";
import { logout } from "@/features/ui/authSlice";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.ui.mode);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  console.log(isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setIsAuthenticated(false);
  };
  const login = () => {
    router.push("/selectRole");
  };

  return (
    <main>
      <Box sx={{ textAlign: "right", padding: "1rem" }}>
        {isAuthenticated ? (
          <Button variant="contained" onClick={() => handleLogout()}>
            Logout
          </Button>
        ) : (
          <Button variant="contained" onClick={() => login()}>
            Login
          </Button>
        )}
      </Box>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          py: 8,
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              color="primary"
            >
              KartSquare Portal
            </Typography>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Enterprise Frontend Architecture
            </Typography>
            <Typography variant="body1" paragraph>
              Built with Next.js 14, TypeScript, Redux Toolkit, and Material UI
              v5.
            </Typography>

            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  mode === "light" ? <DarkModeIcon /> : <LightModeIcon />
                }
                onClick={() => dispatch(toggleTheme())}
                color={mode === "light" ? "secondary" : "warning"}
              >
                Switch to {mode === "light" ? "Dark" : "Light"} Mode
              </Button>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* Redux State Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Global State (Redux)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Theme Mode: <strong>{mode.toUpperCase()}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Managed via <code>uiSlice</code> and typed hooks.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tech Stack Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tech Stack
                  </Typography>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    <li>
                      <Typography variant="body2">
                        Next.js App Router
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">TypeScript Strict</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Material UI v5</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Redux Toolkit</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Axios Interceptors
                      </Typography>
                    </li>
                  </ul>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </main>
  );
}
