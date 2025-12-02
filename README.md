# Certification Management System

A Centralized Digital Platform for Certificate Distribution and Access

Abstract
The Certification Management System is a digital platform that centralizes the storage, distribution, and verification of event certificates. Event organizers upload certificates under each event name so students can log in to view and download their certificates anytime. Faculty advisors have role-based access to track certificates for their students. The system reduces manual validation, repeated communications, and the difficulty students face in organizing certificates spread across disparate links and platforms. It creates a secure, verified, and accessible digital archive of student achievements.

Tech Stack
Backend:
- Python
- Flask

Frontend:
- React.js
- Vite
- Tailwind CSS

Database & Storage:
- Supabase 

Utilities & Libraries:
- Axios / Fetch for API calls
- Flask extensions (Flask-CORS, Flask-RESTful or Flask-Smorest, etc.)
- Supabase Python / JavaScript clients

Project Structure
/backend                # Flask backend, API and Supabase integration
  ├─ app.py             # Main Flask application (or package entrypoint)
  ├─ api/               # API endpoints and route handlers
  ├─ services/          # Business logic (uploads, verification, role checks)
  ├─ models/            # Data access layer or Supabase helpers
  ├─ scripts/           # Helper scripts (migrations, seed, maintenance)
  └─ requirements.txt

              # React.js + Vite frontend (dashboard and user UI)
/src/
/public/
package.json
vite.config.js
tailwind.config.js

Getting Started

1. Clone the repository
```bash
git clone https://github.com/FidhaAhamed/Certification-Management-System.git
cd Certification-Management-System
```

2. Backend Setup (Flask)
Install dependencies and run:
```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
# set environment variables or create .env from .env.example
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
# or
python -m flask run
```
The backend will be available at http://localhost:5000 by default.

3. Frontend Setup (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
The frontend development server will typically run at http://localhost:5173.


Sample Certificate Fields (CSV / DB)
- certificate_id
- user_id
- user_name
- user_email
- event_id
- event_name
- file_path (Supabase storage path or public URL)
- issued_at
- revoked (boolean)
- issued_by (organizer id)
- metadata (JSON: e.g., role, grade, remarks)

Testing
Backend:
```bash
cd backend
pytest
```
Frontend:
```bash
cd frontend
npm test
```

Contributing
1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes, add tests, update docs
4. Open a PR with a clear description of your changes

License
This project is licensed under the MIT License.
Maintainer / Contact
Maintainer: FidhaAhamed  
Repository: https://github.com/FidhaAhamed/Certification-Management-System
