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

---

## 📂 Organización del Proyecto (Arquitectura Limpia)

El proyecto sigue una arquitectura limpia, separando responsabilidades en capas bien definidas:

- `src/application/`  
  Contiene casos de uso y lógica de aplicación.  
  Aquí se orquesta cómo interactúan los distintos componentes del dominio con la infraestructura.

- `src/domain/`  
  Define las entidades, modelos y reglas de negocio puras.  
  Esta capa no depende de frameworks ni de detalles técnicos.

- `src/functions/`  
  Handlers de AWS Lambda expuestos por SAM.  
  Cada función actúa como punto de entrada, delegando la lógica a la capa de aplicación.

- `src/infrastructure/`  
  Implementaciones concretas de servicios externos (bases de datos, colas, APIs, almacenamiento).  
  Aquí se definen adaptadores y conectores que cumplen contratos definidos en el dominio.

- `tests/`  
  Pruebas unitarias y de integración, organizadas en paralelo a las capas anteriores.

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
