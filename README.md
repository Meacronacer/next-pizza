# Next Pizza — Online Food Ordering

A full-stack responsive web application for ordering food online. Built with Django REST Framework (JWT + OAuth2 Google, email confirmation, password reset), PostgreSQL, React/Next.js (React Hook Form + Yup validation), LiqPay integration, session-based cart, search, and auto-generated API docs.

[![Demo](https://img.shields.io/badge/Live-Demo-green)](https://next-pizza-lilac-five.vercel.app)

---

## 🎯 Features

- **Authentication & Authorization**  
  - JWT (access + refresh tokens in secure cookies)  
  - OAuth2 login with Google  
  - Email confirmation on registration  
  - Password reset via email  

- **Shopping Cart**  
  - Session-based cart persists between pages  
  - Add/remove/update items and extras  

- **Checkout & Orders**  
  - “Cash on Delivery” or online payment via LiqPay  
  - Order status workflow: `pending` → `completed`  
  - Secure webhook callback handling  
  - Order success verification page with unique token  

- **Frontend**  
  - Next.js + React  
  - Responsive design (mobile ↔ desktop)  
  - React Hook Form + Yup for client-side form validation  
  - Dynamic search for products  

- **API Documentation**  
  - Automated OpenAPI/Swagger with **drf-spectacular**  
  - Browse at `/api/schema/` & `/api/docs/`

---

## 🚀 Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| **Backend**     | Python, Django 5.x, Django REST Framework     |
| **Auth**        | SimpleJWT, OAuth2 (Google), email tokens      |
| **Payments**    | LiqPay API (sandbox + production)             |
| **Database**    | PostgreSQL (via `dj-database-url`)            |
| **Static Files**| Whitenoise                                    |
| **Sessions**    | Django session framework (DB backend)         |
| **Frontend**    | Next.js, React, Tailwind CSS                  |
| **Forms**       | React Hook Form, Yup                          |
| **Docs**        | drf-spectacular (OpenAPI + Swagger UI)        |

---

## 📦 Installation & Environment

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Meacronacer/next-pizza.git
   cd next-pizza
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env` and fill in values:
   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=False

   DATABASE_URL=postgres://user:password@host:port/dbname

   CLIENT_URL=https://your-frontend.vercel.app
   API_URL=https://your-backend.railway.app

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   LIQPAY_PUBLIC_KEY=your_liqpay_public_key
   LIQPAY_PRIVATE_KEY=your_liqpay_private_key
   LIQPAY_CALLBACK_URL=https://your-backend.railway.app/api/orders/liqpay-callback/

   EMAIL_HOST=smtp.yourmail.com
   EMAIL_HOST_USER=your_email_username
   EMAIL_HOST_PASSWORD=your_email_password
   ```

---

## ⚙️ Backend Setup

1. **Create & activate virtualenv**  
   ```bash
   python -m venv venv
   source venv/bin/activate   # on Linux/macOS
   venv\Scripts\activate      # on Windows
   ```

2. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Database migrations & superuser**  
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Collect static files**  
   ```bash
   python manage.py collectstatic --noinput
   ```

5. **Run development server**  
   ```bash
   python manage.py runserver
   ```

---

## 🌐 Frontend Setup

1. **Navigate to frontend folder**  
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**  
   ```bash
   npm install
   ```

3. **Copy and edit `.env.local`**  
   ```bash
   cp .env.local.example .env.local
   ```
   Update:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**  
   ```bash
   npm run dev
   ```

---

## 🔒 Authentication Flow

- **JWT** stored in `HttpOnly`, `Secure`, `SameSite=None` cookies  
- **Refresh** token rotation + blacklist on logout  
- **Google OAuth2** via custom backend endpoint  
- **Email confirm**: time-limited signed token  

---

## 💳 LiqPay Integration

- Generates Base64 payload & SHA1 signature in backend  
- `server_url` webhook → updates order status in DB  
- `result_url` → redirects user back with `?token=`  
- **Sandbox** mode default for testing; switch `"sandbox": "0"` in production  

---

## 📁 API Documentation

Auto-generated OpenAPI schema & Swagger UI:

- **Schema JSON/YAML**: `GET /api/schema/`  
- **Swagger UI**: `GET /api/docs/`  

Uses [drf-spectacular](https://drf-spectacular.readthedocs.io/) for interactive docs.

---

## 🎨 Frontend Validation

- **React Hook Form** + **Yup**  
- Inline error messages & phone number masking  
- Synchronized with user profile defaults  

---

## ☁️ Deployment

### Backend (Railway / Heroku)

- **Procfile**:
  ```
  web: python manage.py migrate && python manage.py collectstatic --noinput && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
  ```
- Set environment vars in dashboard  
- Configure CORS & CSRF trusted origins  

### Frontend (Vercel)

- Set `NEXT_PUBLIC_API_URL` env var  
- Deploy via GitHub integration  

---

## 🤝 Contributing

1. Fork & clone  
2. `git checkout -b feat/your-feature`  
3. Implement & test locally  
4. `git push origin feat/your-feature` & open a PR  

---

## 📜 License

MIT © [Ivan Popovych](https://github.com/meacronacer)
