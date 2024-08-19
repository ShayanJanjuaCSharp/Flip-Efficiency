'use client'

import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import posthog from 'posthog-js'

let appTitle = "Flip Efficiency"

export default function Home() {

  const router = useRouter()

  // Initialize PostHog
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init('YOUR_POSTHOG_API_KEY', { api_host: 'https://app.posthog.com' })

      // Example of capturing an event
      posthog.capture('page_loaded', { appTitle })
    }
  }, [])

  const sendToFlashcards = async () => {
    posthog.capture('navigate_to_flashcards')
    router.push('/generate')
  }

  const handleSubmit = async () => {
    posthog.capture('donate_button_clicked')

    const checkoutSession = await fetch('/api/checkout_session', {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: "#FFDAB9", minHeight: "100%" }}>
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
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{textAlign: "center", my: 4, backgroundColor:"#FFDAB9" }}>
        <Typography variant='h2' >Welcome to {appTitle}!</Typography>
        <Typography variant="h5" >The easiest way to make flashcards from your text!</Typography>
        <Button variant='contained' onClick={sendToFlashcards} sx={{mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}}>Get Started</Button>
      </Box>

      <Box sx={{my: 6, textAlign: "center", backgroundColor:"#FFDAB9" }}>
        <Typography variant='h4' components="h2" >Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" >Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
          </Grid>
          <Grid item xs={12} md={4} >
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying</Typography>
          </Grid>
          <Grid item xs={12} md={4} >
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: "center"}}>
        <Typography variant='h4' components="h2">Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2}}>
              <Typography variant="h5" >Basic</Typography>
              <Typography variant="h6">Free</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button variant='contained'  sx={{mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}} onClick={sendToFlashcards}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2}}>
              <Typography variant="h5" >Donate</Typography>
              <Typography variant="h6" >Help support our up and coming startup company by donating $2</Typography>
              <Button variant='contained' sx={{mt: 2, backgroundColor: "#634526", '&:hover': { backgroundColor: "#52371E" }}} onClick={handleSubmit}>DONATE HERE</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
