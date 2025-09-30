# 📱 Informatica Monorepo

Este repositorio utiliza una **arquitectura monorepo** para gestionar tanto el **frontend móvil (Expo/React Native)** como el **backend (Express + Prisma)** en un mismo lugar.  

Un **monorepo** permite compartir configuraciones, dependencias y scripts entre diferentes aplicaciones dentro del mismo proyecto.

---

## 📂 Estructura del proyecto

Informatica/
├── apps/
│   ├── api/       # Backend (Express + Prisma)
│   └── mobile/    # Frontend (Expo / React Native)
├── .env           # Variables globales
└── package.json   # Dependencias y scripts compartidos

---

## ⚙️ Instalación de dependencias

```bash
# En la raíz del proyecto
npm install

# En el backend
cd apps/api
npm install

# En el frontend
cd ../mobile
npm install


## Si encuentras problemas de dependencias, usa:

npm install --legacy-peer-deps


## Levantar el proyecto

🔹 Backend (API)

cd apps/api
npm run dev

🔹 Frontend (Expo App)

cd apps/mobile
npx expo start