import express from 'express'
import Contact from '../models/Contact.js'
import { firebaseAuth } from '../middlewares/firebaseAuth.js'


const router=express.Router()

router.post('/', async(req,res)=>{
    try {
      
        const { fullName, email, subject, message }=req.body

        if (!fullName || !email || !subject || !message) {
                  return res.status(400).json({ error: "All fields are required." });

        }

                  const newContact=new Contact({fullName,email,subject,message})
                  await newContact.save()
                   res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
            res.status(500).json({ error: "Server error. Please try again later." });

        
    }
})

export default router;