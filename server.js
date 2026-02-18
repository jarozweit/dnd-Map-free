import express from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/order", async (req, res) => {
    const { firstname, lastname, email, description } = req.body;

    try {
        // Mail an dich
        await resend.emails.send({
            from: "DND Map <onboarding@resend.dev>",
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
        });

        // Mail an den Kunden
        await resend.emails.send({
            from: "DND Map <onboarding@resend.dev>",
            to: email,
            subject: "Bestellbestätigung – Deine D&D‑Map",
            text: `
Hallo ${firstname},

vielen Dank für deine Bestellung deiner individuellen D&D‑Map!

Ich habe deine Anfrage erhalten und melde mich so schnell wie möglich bei dir,
um Details zu klären und den nächsten Schritt zu besprechen.

Hier nochmal deine Angaben:

Beschreibung:
${description}

Beste Grüße
Jaro
            `
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft auf Railway");
});
