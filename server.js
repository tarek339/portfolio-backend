const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req,res)=>{
   res.json(`server is running on ${new Date()}`)
})

app.post("/", async (req,res)=>{
    try {
        if(!req.body.salutation) {
            return(res.status(422).json({
                message:"Bitte Anrede auswählen"
            }))
        }
        if(req.body.firstName.length === 0) {
            return(res.status(422).json({
                message:"Bitte Vornamen eingeben"
            }))
        }
        if(!req.body.firstName.match(/^[a-zA-Z\s]*$/)) {
            return(res.status(422).json({
                message:"Vorname nur aus Buchstaben"
            }))
        }
        if(req.body.lastName.length === 0) {
            return(res.status(422).json({
                message:"Bitte Vornamen eingeben"
            }))
        }
        if(!req.body.lastName.match(/^[a-zA-Z\s]*$/)) {
            return(res.status(422).json({
                message:"Vorname nur aus Buchstaben"
            }))
        }
        if(req.body.email.length === 0) {
            return(res.status(422).json({
                message:"Bitte E-Mail eingeben"
            }))
        }
        if(!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            return(res.status(422).json({
                message:"Ungültige E-Mail"
            }))
        }
        if(!req.body.phone.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g) && req.body.phone) {
            return(res.status(422).json({
                message:"Ungültige Rufnummer"
            }))
        }
        if(!req.body.terms) {
            return(res.status(422).json({
                message:"DSGVO-Bestimmung akzeptieren"
            }))
        }
    console.log(req.body)
    const transport = nodemailer.createTransport({
        service: "gmail",
        port: false, 
        secure: true,
        auth: { 
            user: "tarekjassine@gmail.com",
            pass: "wonoytjxbqgxhjtm"
        }
    })

    await transport.sendMail(
        {
            from: "tarekjassine@gmail.com",
            to: req.body.email,
            subject: `Ihre Anfrage vom ${new Date().toLocaleString("de-DE")}`, 
            html: `<p>Guten Tag ${req.body.firstName} ${req.body.lastName},</p>`,
        }
    )

    await transport.sendMail(
        {
            from: "tarekjassine@gmail.com",
            to: "tarekjassine@gmail.com",
            subject: `Kundenanfrage vom ${new Date().toLocaleString("de-DE")}`,
            html: `
            <div>
                <p>salutation: ${req.body.salutation}</p>
                <p>first name: ${req.body.firstName}</p>
                <p>last name: ${req.body.lastName}</p>
                <p>e-mail: ${req.body.email}</p>
                <p>phone: ${req.body.phone}</p>
                <p>company: ${req.body.company}</p>
                <p>message: ${req.body.description}</p>
                <p>terms accepted: ${req.body.terms}</p>
            </div>`
        }
    )

    res.json({
        formData: req.body,
        message: "Sie haben mich kontaktiert, vielen Dank!",
    })
    } catch (err) {
        res.status(404).json({
            message:"Please try again!"
        })
    }
})

const port = process.env.PORT || 8000
app.listen(port, ()=>{ 
    console.log(`server is running on ${port} on ${new Date().toLocaleString("DE-de")}`)
})