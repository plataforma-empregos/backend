# 💼 TrampoMatch — Plataforma de Vagas

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Swagger](https://img.shields.io/badge/Swagger-API-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

---

O **TrampoMatch** é uma API completa para gestão de vagas, autenticação de usuários e integração com APIs públicas de emprego.
Com documentação completa no Swagger, autenticação JWT, envio de e-mails e integração com a API pública **JSearch (RapidAPI)**.

---

## 🧠 Demonstração Visual

### 📘 Interface do Swagger
![Swagger UI](https://raw.githubusercontent.com/github/explore/main/topics/swagger/swagger.png)

### 📨 Fluxo de Recuperação de Senha
![E-mail](https://raw.githubusercontent.com/github/explore/main/topics/nodemailer/nodemailer.png)

---

## 🚀 Funcionalidades Principais

- Autenticação JWT com refresh token
- Login social e 2FA via OTP
- CRUD completo de vagas e perfis
- Recuperação de senha por e-mail (SMTP)
- Integração com API pública de vagas (JSearch)
- Documentação interativa via Swagger UI

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| **Backend** | Node.js, Express.js |
| **Banco de Dados** | MongoDB (Mongoose) |
| **Autenticação** | JWT, bcrypt, 2FA (speakeasy) |
| **Documentação** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Integração Externa** | API pública JSearch (RapidAPI) |
| **Envio de E-mails** | Nodemailer (SMTP Gmail) |

---

## ⚙️ Como Rodar o Projeto

```bash
# 1️⃣ Clonar o repositório
git clone https://github.com/plataforma-empregos/backend.git
cd trampomatch

# 2️⃣ Instalar dependências
npm install

# 3️⃣ Criar o arquivo .env
cp .env.example .env

# 4️⃣ Rodar o servidor
npm run dev
```

---

## 🧾 Exemplo de .env

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/trampomatch
JWT_SECRET=teste1234567890
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_FROM=seuemail@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app
RAPIDAPI_KEY=sua_chave_rapidapi_aqui
BASE_URL=http://localhost:3000
```
---

## 🧭 Swagger UI

Após iniciar o servidor, acesse:

👉 **http://localhost:3000/api-docs**

![Swagger Example](https://raw.githubusercontent.com/github/explore/main/topics/openapi/openapi.png)

---

## 📂 Estrutura do Projeto

```
src/
 ├── app/
 │   ├── config/
 │   ├── controllers/
 │   ├── models/
 │   ├── services/
 │   ├── middlewares/
 │   └── jobs/
 ├── routes.js
 ├── app.js
 └── server.js
```

---
