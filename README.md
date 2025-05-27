# 📦 Product Management App

Esta es una aplicación web diseñada para gestionar productos. Permite **crear, editar, listar y validar productos**, incluyendo campos como ID, nombre, descripción, fecha de liberación, fecha de revisión y logo. Está desarrollada en **Angular** para el frontend y utiliza **JSON Server** como backend simulado.

---

## 🚀 ¿Qué hace esta app?

- 📄 Muestra una lista de productos registrados.
- 📝 Permite agregar o editar productos con validaciones específicas.
- 📆 Calcula automáticamente la fecha de revisión (1 año después de la fecha de liberación).
- 🔍 Permite aplicar filtros y paginación.

---

## 🛠️ Requisitos previos

- Node.js instalado
- NPM instalado

---

## ⚙️ Levantar el servidor API (JSON Server)

1. Abre una terminal y navega a la carpeta raíz del proyecto.
2. Entra al directorio `api`:

   ```bash
   cd api

3. Ejecuta el servidor con:

   ```bash
   json-server --watch db.json --port 3000
   ```

   Esto iniciará una API RESTful en `http://localhost:3000`.

---

## 🖥️ Levantar el frontend (Angular)

Desde otra terminal:

```bash
ng serve
```

Luego abre `http://localhost:4200` en tu navegador.

---

## 📁 Estructura básica del proyecto

```
/api
  └── db.json             # Base de datos falsa para JSON Server
/src
  └── app/
      └── product-form/   # Componente del formulario de productos
```

---

## ✅ Notas adicionales

* Si editas `db.json`, recuerda reiniciar el servidor JSON para aplicar los cambios.
* Puedes acceder a los endpoints simulados desde `http://localhost:3000/products`.

---

## 🧑‍💻 Autor

Proyecto desarrollado por Nicolas moina – para fines de aprendizaje o como base de proyectos CRUD.

