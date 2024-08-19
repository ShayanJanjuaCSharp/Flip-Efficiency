import { SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";

let appTitle = "Flip Efficiency";

export default function SignInPage() {
  return (
    <Container
      maxWidth="false" // Changed to false to allow full width
      sx={{
        backgroundColor: "#FFDAB9",
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure full height of viewport
        padding: 0, // Remove default padding
      }}
    >
      <AppBar position='static' sx={{ backgroundColor: "#C99A83" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{appTitle}</Typography>
          <Button color="inherit" href='/sign-in'>Sign In</Button>
          <Button color="inherit" href='/sign-up'>Sign Up</Button>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1} // Allow the Box to take up remaining space
        padding={2} // Add some padding around the content
      >
        <Typography variant="h4">Sign Up</Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
