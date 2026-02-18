import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
app.use(express.static("public")); // <-- dein HTML wird ausgeliefert

// E-Mail Transporter (Railway ENV Variablen!)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post("/api/order", async (req, res) => {
    const { firstname, lastname, email, description } = req.body;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: "Neue D&D‑Map Bestellung",
        text: `
Neue Bestellung erhalten:

Vorname: ${firstname}
Nachname: ${lastname}
E-Mail: ${email}

Beschreibung:
${description}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.listen(process.env.PORT || 3000, () =>
    console.log("Server läuft auf Railway")
);
