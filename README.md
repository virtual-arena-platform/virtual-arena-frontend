# Virtual Arena Frontend

Frontend for Virtual Arena, an article-sharing platform. Built with React, it covers article creation and browsing, comments, and user profiles, and talks to the Spring Boot backend over a REST API.

Live demo: https://virtual-arena-frontend.onrender.com

## Features

JWT-based authentication with refresh tokens, email verification, protected routes, and profile management. Article creation and editing with a Draft.js rich text editor, plus liking, bookmarking, and social sharing. Search with filters, a featured articles section, and paginated latest articles with infinite scroll. Nested comments with replies, detailed user profiles, and following is in progress.

## Tech stack

React 18, Material-UI, Redux Toolkit, Draft.js, React Router v6, Axios, date-fns, and React Toastify.

## Running locally

You will need Node.js 14 or higher, npm or yarn, and Git.

```
git clone https://github.com/virtual-arena-platform/virtual-arena-frontend.git
cd virtual-arena-frontend
npm install
npm start
```

## Hosting note

The backend runs on Render's free tier, so it sleeps after 15 minutes without traffic. The first request after that can take 30 to 60 seconds while it wakes up; after that it responds normally.

## Related

Backend: https://github.com/virtual-arena-platform/virtual-arena-backend

Author: Konstantine Vashalomidze
