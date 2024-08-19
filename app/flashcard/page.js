'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams, useRouter } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Toolbar, Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [backgcolor, setbgcolor] = useState("#ffffff");
  const [textcolor, settextcolor] = useState("#000000");

  const searchParams = useSearchParams()
  const search = searchParams.get("id")
  const router = useRouter()

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return

      const colRef = collection(doc(db, "users", user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      try {
        const response = await fetch('/api/colourTheming', {
          method: "POST",
          body: search,
        });

        if (response.ok) {
          const data = await response.json();

          if (data.textcolor && data.bgcolor) {
            settextcolor(data.textcolor);
            setbgcolor(data.bgcolor);
          } 
        } 
      } catch (error) {
        console.log(error)
      }
      setFlashcards(flashcards)
    }

    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleHome = async () => {
    await router.push('/')
  }

  const handleGen = async () => {
    await router.push('/generate')
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh", // Ensures the Box takes the full height of the viewport
        backgroundColor: '#FFDAB9',
        display: "flex",
        flexDirection: "column"
      }}
    >
      <AppBar position='static' sx={{ backgroundColor: "#C99A83" }}>
        <Toolbar>
          <Typography variant='h6' style={{ flexGrow: 1 }}>Flip Efficiency</Typography>
          <SignedOut>
            <Button color="inherit" href='/sign-in'>Sign In</Button>
            <Button color="inherit" href='/sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <Button onClick={handleHome} sx={{ color: '#4B3621' }}>Home</Button>
            <Button onClick={handleGen} sx={{ color: '#4B3621' }}>Generate Flashcards</Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      
      <Container
        sx={{
          flex: 1, // Allows the Container to expand and fill the available space
          display: "flex",
          flexDirection: "column",
          backgroundColor: '#FFDAB9',
          pb: 4 // Padding bottom to ensure spacing from the bottom
        }}
      >
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: backgcolor }}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": { transform: "rotateY(180deg)" },
                    }}>
                      <div>
                        <div>
                          <Typography variant="h5" component="div" sx={{ color: textcolor }}>
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div" sx={{ color: textcolor }}>
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
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
