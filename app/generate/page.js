'use client'

import { useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material"
import { doc, setDoc, getDoc, collection, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/firebase"
import {Toolbar} from '@mui/material'
import Head from 'next/head'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  const [backgcolor, setbgcolor] = useState("#ffffff");
  const [textcolor, settextcolor] = useState("#000000");
  const router = useRouter()

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    }).then((res) => res.json()).then((data) => setFlashcards(data))
    //gets-colours
    try {
      const response = await fetch('/api/colourTheming', {
        method: "POST",
        body: text,
      });

      if (response.ok) {
        const data = await response.json(); 

        
        if (data.textcolor && data.bgcolor) {
          settextcolor(data.textcolor);
          setbgcolor(data.bgcolor);
        } else {
        }
      } else {
        const errorData = await response.json();
        
      }
    } catch (error) {
      
    }
  
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleHome = () => {
    router.push('/')
  }
  const handleFC = () => {
    router.push('/flashcards')
  }

  const handleClose = () => {
    setOpen(false)
  }

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcard.")
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, "users"), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []

      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.")
        return
      } else {
        collections.push((name))
        batch.set(userDocRef, {flashcards: collections}, {merge: true})
      }
    } else {
      batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push("/flashcards")
  }

  return (
    <Box
  sx={{
    backgroundColor: "#FFDAB9",
    minHeight: "100vh", // Ensures full height
    width: "100vw",     // Ensures full width
    display: "flex",
    flexDirection: "column",
  }}
>
  <AppBar position="static" sx={{ backgroundColor: "#C99A83" }}>
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Flip Efficiency
      </Typography>
      <SignedOut>
        <Button color="inherit" href="/sign-in">
          Sign In
        </Button>
        <Button color="inherit" href="/sign-up">
          Sign Up
        </Button>
      </SignedOut>
      <SignedIn>
        <Button onClick={handleHome} sx={{ color: "#4B3621" }}>
          Home
        </Button>
        <Button onClick={handleFC} sx={{ color: "#4B3621" }}>
          Flashcards
        </Button>
        <UserButton />
      </SignedIn>
    </Toolbar>
  </AppBar>
  <Container sx={{ flex: 1, backgroundColor: "#FFDAB9" }}> {/* Let Container be responsive */}
    <Box
      sx={{
        mt: 4,
        mb: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFDAB9",
      }}
    >
      <Typography variant="h4">Generate Flashcards</Typography>
      <Paper
        sx={{ p: 4, width: "100%", backgroundColor: "#ffe2cc" }}
        elevation={8}
        spacing={2}
      >
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { color: "#4B3621" },
            "& .MuiInputLabel-root": { color: "#4B3621" },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4B3621",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              { borderColor: "#4B3621" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#4B3621" },
          }}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#4B3621" }}
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
      </Paper>
    </Box>

    {flashcards.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Flashcards Preview
        </Typography>
        <Grid container spacing={3}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: backgcolor }}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          transition: "transform 0.6s",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          boxShadow:
                            "0 4px 8px 0 rgba(0,0,0,0.2)",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          boxShadow:
                            "0 4px 8px 0 rgba(0,0,0,0.2)",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{ color: textcolor }}
                          >
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{ color: textcolor }}
                          >
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

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="secondary" onClick={handleOpen}>
            Save
          </Button>
        </Box>
      </Box>
    )}

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Save Flashcards</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcards collection
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Collection Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={saveFlashcards}>Save</Button>
      </DialogActions>
    </Dialog>
  </Container>
</Box>
  )
}