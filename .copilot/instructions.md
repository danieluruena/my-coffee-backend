# Copilot Project Instructions

## 📌 Contexto del Proyecto

Este repositorio implementa un backend **serverless** en **AWS** usando **SAM (Serverless Application Model)** y está escrito en **TypeScript**.  
El objetivo es mantener un código limpio, modular y fácil de desplegar en AWS Lambda.

---

## 🛠️ Convenciones de Código

- Lenguaje principal: **TypeScript**.
- Estilo: seguir **ESLint + Prettier** configurados en el proyecto.
- Usar **async/await** en lugar de promesas encadenadas.
- Evitar `any`; preferir **tipos explícitos** y **interfaces**.
- Nombres de funciones y variables en **camelCase**.
- Clases y tipos en **PascalCase**.
- Nombre de archivos en **LowerPascalCase**.
- Preferir arrow functions siempre que sea posible

---

## 📂 Organización del Proyecto (Arquitectura Limpia)

El proyecto sigue una arquitectura limpia organizada por dominios de negocio. Cada dominio mantiene sus propias capas hexagonales:

- `src/auth/`
  Autenticación, authorizer, identidad y validación de tokens.

- `src/user/`
  Perfil y datos internos del usuario.

- `src/coffee/`
  Registro, consulta, edición, eliminación, fotografías y estadísticas de cafés.

- Dentro de cada dominio, `application/` contiene casos de uso y puertos, `domain/` define entidades y reglas puras, `infrastructure/` contiene adaptadores concretos y `functions/` expone handlers de AWS Lambda.

- `src/shared/`
  Código transversal reutilizable, como configuración, interfaces, utilidades, adaptadores comunes y funciones técnicas como health. No debe contener reglas de negocio propias de un dominio.

- `tests/`  
  Pruebas organizadas en paralelo a los dominios y sus capas.

---

## 🔐 Buenas Prácticas

- No incluir secretos en el código. Usar **AWS Secrets Manager** o **SSM Parameter Store**.
- Manejar errores con `try/catch` y devolver respuestas HTTP claras.
- Validar entradas con librerías como `ajv` o `class-validator`.

---

## 🧪 Testing

- Framework: **Jest**.
- Cada handler debe tener pruebas unitarias.
- Usar mocks para servicios externos (DynamoDB, S3, etc.).

---

## 🚀 Despliegue

- Los comandos principales son:
  - `sam build`
  - `sam deploy --guided`
- Mantener `template.yaml` actualizado con los recursos necesarios.
- Usar **stages** (`dev`, `staging`, `prod`) definidos en parámetros SAM.

---

## 📖 Documentación

- Documentar cada handler con **JSDoc**.
- Mantener actualizado el archivo `README.md` con instrucciones de uso.
- Este archivo (`.copilot/instructions.md`) sirve como guía para Copilot: todas las sugerencias deben seguir estas convenciones.
