import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
app.use(express.static("public")); // Statische Dateien ausliefern

// Transporter erst beim Senden verbinden
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// API‑Route für Bestellungen
app.post("/api/order", async (req, res) => {
    const { firstname, lastname, email, description } = req.body;

    // Mail an dich
    const adminMail = {
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

    // Mail an den Kunden
    const customerMail = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Bestellbestätigung – Deine D&D‑Map",
        text: `
Hallo ${firstname},

vielen Dank für Ihre Bestellung deiner individuellen D&D‑Map!

Ich habe Ihre Anfrage erhalten und melde mich so schnell wie möglich bei dir.

Hier nochmal deine Angaben:

Beschreibung:
${description}

Beste Grüße
Ihr D&D-Map-Entwicklungsteam
        `
    };

    try {
        await transporter.sendMail(adminMail);
        await transporter.sendMail(customerMail);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// Server starten
app.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft auf Railway");
});
