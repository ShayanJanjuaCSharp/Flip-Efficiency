import { SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from "@mui/material";

let appTitle = "FireFlash"

export default function SignInPage() {
  return <Container maxWidth="sm">
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>{appTitle}</Typography>
        <Button color="inherit">
          <Link href="/sign-in" passHref>Sign In</Link>
        </Button>
        <Button color="inherit">
          <Link href="/sign-up" passHref>Sign Up</Link>
        </Button>
      </Toolbar>
    </AppBar>

    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4">Sign Up</Typography>
      <SignUp />
    </Box>
  </Container>
}