'use client'

import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/navigation' 
import { trackEvent } from '@/utils/posthog'

let appTitle = "Flip Efficiency"

export default function Home() {
  const router = useRouter() 

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is correct
        },
      });
  
      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Try to parse the JSON response
      const checkoutSessionJson = await response.json();
      
      if (response.status === 500) {
        console.error('Server error:', checkoutSessionJson.message);
        return;
      }
  
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
  
      if (error) {
        console.warn('Stripe error:', error.message);
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  const handleGen = async () => {
    trackEvent('Navigate to Generate');
    router.push('/generate') 
  }

  const handleFC = async () => {
    trackEvent('Navigate to Flashcards');
    router.push('/flashcards') 
  }

  return (
    <Container 
      maxWidth="100vw" 
      sx={{ 
        backgroundColor: "#FFDAB9", 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between" 
      }}
    >
      <Head>
        <title>{appTitle}</title>
        <meta name='description' content='Create flashcards from your text!' />
      </Head>

      <AppBar position='static' sx={{ backgroundColor: "#C99A83" }}>
        <Toolbar>
          <Typography variant='h6' style={{flexGrow: 1}}>{appTitle}</Typography>
          <SignedOut>
            <Button color="inherit" href='/sign-in'>Sign In</Button>
            <Button color="inherit" href='/sign-up'>Sign Up</Button>
          </SignedOut>
          
          <SignedIn>
            <Button onClick={handleFC} sx={{color:'#4B3621'}}>Flashcards</Button>
            <Button onClick={handleGen} sx={{color:'#4B3621'}}>Generate</Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{textAlign: "center", my: 4, backgroundColor:"#FFDAB9" }}>
        <Typography variant='h2'>Welcome to {appTitle}!</Typography>
        <Typography variant="h5">The easiest way to make flashcards from your text!</Typography>
        <Button 
          variant='contained' 
          sx={{ mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}}
          onClick={handleGen}
        >
          Get Started
        </Button>
      </Box>

      <Box sx={{my: 6, textAlign: "center", backgroundColor:"#FFDAB9" }}>
        <Typography variant='h4' components="h2">Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: "center"}}>
        <Typography variant='h4' components="h2">Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
              <Typography variant="h5">Basic</Typography>
              <Typography variant="h6">Free</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button 
                variant='contained' 
                sx={{ mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}}
                onClick={handleGen}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
              <Typography variant="h5">DONATE</Typography>
              <Typography variant="h6">$2</Typography>
              <Typography>If you would like, you can donate $2 to help fund our small startup</Typography>
              <Button 
                variant='contained' 
                sx={{ mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}}
                onClick={handleSubmit}
              >
                Donate Here
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}