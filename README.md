# Nexora Drive — A Personal Cloud Storage App

A small personal drive: sign up, upload files to your computer, then star, trash, restore, or download them.

<!-- add screenshot here -->

## Features

- Account registration and login with a JWT stored in an httpOnly cookie
- Upload files into a local `uploads` folder
- Download a file under its original name
- Star and unstar files
- Move a file to trash, restore it, or delete it forever
- Client-side search by file name
- Dark mode that stays on as you move between pages

## Tech stack

- Node.js and Express
- EJS templates
- MongoDB and Mongoose
- JWT and bcrypt
- Multer for local uploads
- Tailwind CSS from a CDN, plus plain JavaScript

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB connection string you can use

## Installation

```bash
git clone <your-repo-url>
cd DERIVE
npm install
```

Create a `.env` file in the project folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nexora-drive
JWT_SECRET=replace-this-with-a-long-random-string
PORT=3000
```

Create the folder Multer writes into, then start the app:

```bash
mkdir uploads
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Create an account at `/user/register`.
2. Log in at `/user/login`. Check **Remember me** if the cookie should last 30 days.
3. On **My Drive**, choose a file and click **Upload**.
4. Download it, star it, or move it to trash.
5. Open **Starred**, **Recent**, or **Trash** from the sidebar.
6. From Trash, restore a file or delete it forever.
7. Use the search box to filter the list you are looking at.
8. Use the moon/sun button to switch theme. Log out when you are done.

## Project structure

```text
DERIVE/
├── app.js
├── package.json
├── .env
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── models/
│   ├── user.model.js
│   └── file.model.js
├── routes/
│   ├── user.routes.js
│   ├── index.routes.js
│   └── file.routes.js
├── views/
│   ├── register.ejs
│   ├── login.ejs
│   └── home.ejs
└── uploads/
```

## Roadmap

- Optional cloud storage, instead of only the local `uploads` folder
- Sharing a file with another person
- Folders
- File versions

<!-- add screenshot here -->

## License

MIT

## Author

Farhan Saeed
