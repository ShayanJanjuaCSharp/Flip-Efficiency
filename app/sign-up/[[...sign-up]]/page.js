import { SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from "@mui/material";

let appTitle = "FireFlash"

export default function SignInPage() {
  return  <Container maxWidth="100vw" sx={{ backgroundColor: "#FFDAB9", maxHeight:"100vh" }}>
    <AppBar position='static' sx={{ backgroundColor: "#C99A83" }}>
      <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>{appTitle}</Typography>
        <Button color="inherit" href='/sign-in'>Sign In</Button>
        <Button color="inherit" href='/sign-up'>Sign Up</Button>
      </Toolbar>
    </AppBar>

    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4">Sign Up</Typography>
      <SignUp />
    </Box>
  </Container>
}