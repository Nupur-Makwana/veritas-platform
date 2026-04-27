# Veritas — Vercel Deployment Guide

## Prerequisites
- Firebase project set up
- Gemini API key from https://aistudio.google.com

## Step 1: Push to GitHub
Make sure `firebase-applet-config.json` and `.env*` files are in `.gitignore` (already done).

## Step 2: Deploy to Vercel
1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Framework: **Vite**
3. Build Command: `vite build` (or `npm run build`)
4. Output Directory: `dist`

## Step 3: Set Environment Variables in Vercel
In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `VITE_GEMINI_API_KEY` | Your Gemini API key |
| `VITE_FIREBASE_API_KEY` | From Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console |
| `VITE_FIREBASE_APP_ID` | From Firebase Console |
| `VITE_FIREBASE_DATABASE_ID` | Your Firestore DB ID (if not default) |

## Step 4: Firebase Auth — Add Vercel Domain
In Firebase Console → Authentication → Settings → Authorized Domains:
- Add your Vercel domain: `your-project.vercel.app`

## Step 5: Redeploy
After setting env vars, trigger a redeploy in Vercel.

## Demo Credentials
| Role | ID | Password |
|---|---|---|
| Citizen | `TEAM_AGNEYA_CITIZEN` | `TEAM@4` |
| Field Worker | `TEAM_AGNEYA_FIELD WORKER` | `FIELD@4` |
| Admin | `TEAM_AGNEYA_CONTROL` | `CONTROL@4` |
