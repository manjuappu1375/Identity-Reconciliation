// To install SQLite, follow these steps:
// 1. Install SQLite from https://www.sqlite.org/download.html
// 2. Add SQLite to your system PATH
// 3. Run `npm install sqlite3` to install the SQLite3 package for Node.js

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Contact = sequelize.define('Contact', {
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  linkPrecedence: {
    type: DataTypes.ENUM('primary', 'secondary'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false
});

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    // 1. Fetch contacts matching the email or phoneNumber
    const matchingContacts = await Contact.findAll({
      where: {
        [Sequelize.Op.or]: [
          { email },
          { phoneNumber }
        ]
      }
    });

    let primaryContact;
    let secondaryContacts = [];
    let emails = [];
    let phoneNumbers = [];

    if (matchingContacts.length === 0) {
      // No matching contacts, create a new primary contact
      primaryContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // There are matching contacts; find the primary contact
      primaryContact = matchingContacts.find(contact => contact.linkPrecedence === 'primary') || matchingContacts[0];

      // Add secondary contact entries for any new information
      for (const contact of matchingContacts) {
        if (contact.id !== primaryContact.id) {
          secondaryContacts.push(contact);
        }
      }

      // Update emails and phoneNumbers
      emails = matchingContacts.map(contact => contact.email).filter(Boolean);
      phoneNumbers = matchingContacts.map(contact => contact.phoneNumber).filter(Boolean);

      // If the incoming email or phoneNumber is new, create a secondary contact
      if (!emails.includes(email) || !phoneNumbers.includes(phoneNumber)) {
        const newSecondaryContact = await Contact.create({
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        secondaryContacts.push(newSecondaryContact);
      }
    }

    // Prepare the response
    res.status(200).json({
      primaryContactId: primaryContact.id,
      emails: [...new Set([primaryContact.email, ...emails])],
      phoneNumbers: [...new Set([primaryContact.phoneNumber, ...phoneNumbers])],
      secondaryContactIds: secondaryContacts.map(contact => contact.id)
    });
  } catch (error) {
    console.error('Error processing /identify request:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Emotorad Backend Task API');
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
