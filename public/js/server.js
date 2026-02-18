app.post("/api/order", async (req, res) => {
    const { firstname, lastname, email, description } = req.body;

    // E-Mail an dich (Benachrichtigung)
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

    // E-Mail an den Kunden (Bestellbestätigung)
    const customerMail = {
        from: process.env.SMTP_USER,
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
    };

    try {
        // 1. Mail an dich
        await transporter.sendMail(adminMail);

        // 2. Mail an den Kunden
        await transporter.sendMail(customerMail);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});
