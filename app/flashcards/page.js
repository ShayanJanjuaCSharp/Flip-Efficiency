'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { CollectionReference, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import {Button, Toolbar, AppBar, Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Flashcards() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()

  const handleHome = () => {
    router.push('/')
  }
  const handleGen = () => {
    router.push('/generate')
  }

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return

      const userDocRef = doc(db, "users", user.id)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, {flashcards: []})
      }
    }

    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <Box width='100vw' height='100vh' sx={{backgroundColor: '#FFDAB9'}}>
      <AppBar position='static' sx={{ backgroundColor: "#C99A83" }}>
        <Toolbar>
          <Typography variant='h6' style={{flexGrow: 1}}>Flip Efficiency</Typography>
          <SignedOut>
            <Button color="inherit" href='/sign-in'>Sign In</Button>
            <Button color="inherit" href='/sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <Button onClick={handleHome} sx={{color: '#4B3621'}}>Home</Button>
            <Button onClick={handleGen} sx={{color: '#4B3621'}}>Generate</Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
  <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{mt: 4}}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{backgroundColor: '#fff1e6'}}>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h6">{flashcard.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>
  )
}