# 💰 Micro Finance Django App

A Django-based **Micro Finance Management System** that allows users to manage digital wallets, request payments, transfer money, deposit funds, and handle loans.  

This project is built with **Django** and leverages the built-in authentication system to handle users securely.

---

## 🚀 Features

### 👤 User & Profiles
- Users can register/login using Django's authentication system.
- Each user has a **profile** containing phone number and profile picture.
- Automatic tracking of when a profile was added.

### 💳 Wallet Management
- Each user has a **wallet** that stores:
  - `balance` → current available funds.
  - `loan_balance` → active loan amount.
- A computed **total balance** = balance + loan balance.
- Admin can **add balance or loans** to user wallets.

### 🔄 Transactions
- Users can **transfer money** to other users if they have sufficient balance.
- Admin actions (deposit/loan) are recorded as transactions with `sender=None`.
- All transactions are logged with:
  - Sender & Receiver
  - Amount
  - Purpose (`deposit`, `loan`, `transfer`, `request_payment`)
  - Timestamp

### 💰 Payment Requests
- Users can **request money** from other users by specifying amount and purpose.
- Requests are tracked until approved (`is_paid=True`) or rejected.
- Users can approve or reject incoming requests.
- Approved requests automatically update sender and receiver wallets.

### 🖥️ Views / Pages
- **Dashboard**: Shows latest transactions, pending requests, and total balance.
- **Admin Dashboard**: View all users, wallets, and transactions; add balances and loans.
- **Transfer Page**: Users can send money to others.
- **Requests Page**: Create, approve, and reject payment requests.

---

## 🛠️ Tech Stack
- **Backend**: Django
- **Database**: SQLite (default, can be switched to PostgreSQL/MySQL)
- **Auth**: Django's built-in `User` model
- **Media**: Profile images stored under `/images/` (optional, can be ignored in Git)

---

## 📂 Project Structure (Important Apps/Files)
