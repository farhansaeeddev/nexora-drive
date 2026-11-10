# Nexora Drive — A Personal Cloud Storage App

A personal cloud-drive-style web application that allows users to register, log in, upload, download, and manage their files through a simple and user-friendly interface.

## Features

- User registration and login
- JWT authentication using httpOnly cookies
- Remember Me functionality
- Upload files using Multer
- Store uploaded files in a local `uploads` folder
- Download files with their original filenames
- Star and unstar files
- Move files to Trash
- Restore files or permanently delete them
- Client-side search by file name
- Recent files section
- Dark mode with theme persistence

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, Tailwind CSS, JavaScript
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **File Uploads:** Multer

## Prerequisites

Make sure you have the following installed:

- Node.js 18 or newer
- npm
- MongoDB (local installation or connection string)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nexora-drive.git
```

### 2. Navigate to the Project Directory

```bash
cd nexora-drive
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nexora-drive
JWT_SECRET=your_long_random_secret
PORT=3000
```

### 5. Create the Uploads Folder

```bash
mkdir uploads
```

### 6. Start the Application

```bash
npm start
```

Open your browser and visit:

http://localhost:3000

## Usage

1. Create a new account at `/user/register`.
2. Log in at `/user/login`.
3. Select **Remember Me** to keep your login session for up to 30 days.
4. Open **My Drive** and select a file to upload.
5. Download, star, or move your uploaded files to Trash.
6. Open **Starred**, **Recent**, or **Trash** from the sidebar.
7. Restore files from Trash or permanently delete them.
8. Use the search box to find files by name.
9. Switch between Light Mode and Dark Mode using the theme button.
10. Log out when you finish.

## Project Structure

```text
nexora-drive/
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
├── uploads/
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── LICENSE
└── README.md
```

## Storage Information

Currently, Nexora Drive uses local file storage through Multer. Uploaded files are saved in the project's `uploads` directory, while MongoDB stores their related information.

Cloud storage integration is not included yet.

## Future Improvements

- Cloud storage integration (AWS S3 or Cloudinary)
- File sharing between users
- Folder creation and management
- File version history
- File preview functionality

## License

This project is licensed under the MIT License.

## MIT License

Copyright (c) 2026 Farhan Saeed

## Author

**Farhan Saeed**

GitHub: https://github.com/farhansaeeddev
