// 1. Instala els paquets: npm init -y && npm install express nodemailer cors dotenv
// 2. Afegeix un fitxer .env amb:
//    SMTP_HOST=smtp.gmail.com
//    SMTP_PORT=465
//    SMTP_USER=elteucorreu@gmail.com
//    SMTP_PASS=contrassenyaapp
// 3. A Replit configura les variables d’entorn igual

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Ruta per guardar i enviar correu
app.post('/send-quote', async (req, res) => {
  const { nombre, empresa, email, telefono, espai, producto, mensaje } = req.body;

  // Guardar (simulat amb console.log)
  console.log('Nou pressupost:', req.body);

  // Enviar correu
  try {
    await transporter.sendMail({
      from: 'AromaTech <aromatech@carmelites.cat>',
      to: email,
      subject: 'Confirmació sol·licitud de pressupost',
      html: `
        <h2>Gràcies per la teva sol·licitud</h2>
        <p>Hem rebut la teva petició i ens posarem en contacte aviat.</p>
        <ul>
          <li><strong>Nom:</strong> ${nombre}</li>
          <li><strong>Empresa:</strong> ${empresa}</li>
          <li><strong>Producte:</strong> ${producto}</li>
          <li><strong>Espai:</strong> ${espai}</li>
          <li><strong>Missatge:</strong> ${mensaje || '-'}</li>
        </ul>
        <p>Atentament,<br>Equip AromaTech</p>
      `
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
