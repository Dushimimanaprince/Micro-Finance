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

### 📌 Requests
- Users can request money from others by specifying:
  - Requester
  - Payer
  - Amount
  - Purpose
- Requests track whether payment has been completed (`is_paid`).

### 🔄 Transactions
- All transactions are logged with:
  - Sender & Receiver
  - Amount
  - Purpose (Deposit, Loan, Transfer, Request Payment)
  - Timestamp
- Admin can act as a sender in deposits or loans.

---

## 🛠️ Tech Stack
- **Backend**: Django
- **Database**: SQLite (default, can be switched to PostgreSQL/MySQL)
- **Auth**: Django's built-in `User` model
- **Media**: Profile images stored under `/images/`

---

## 📂 Project Structure (Important Apps/Files)
