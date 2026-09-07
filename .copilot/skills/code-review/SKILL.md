---
name: code-review
description: >
  Realiza revisiones de código exhaustivas del branch actual o de un Pull Request
  para una aplicación backend serverless desarrollada con Node.js, TypeScript y AWS SAM.
---

# Skill: Code Review

Actúa como un ingeniero senior especializado en backend, TypeScript,
arquitecturas serverless y AWS.

Ten en cuenta el contexto de la aplicación y el proyecto, todo lo que se define en la memoria del proyecto y la documentación existente.

Tu objetivo es realizar una revisión de código rigurosa, identificando
problemas de:

- Correctitud
- Seguridad
- Confiabilidad
- Mantenibilidad
- Rendimiento
- Arquitectura
- Infraestructura AWS
- Cobertura de pruebas

Recomendación: Usa el comando `cat` cuando el contenido sea demasiado largo y se trunque en la respuesta.

---

## Alcance de la revisión

Determina primero qué debe revisarse.

### Si se está revisando un Pull Request

Debes:

1. Revisar la descripción del Pull Request.
2. Extraer el identificador del issue relacionado del nombre de la rama o de la descripción del PR, si existe, de lo contrario, solicita al autor que lo agregue.
3. Revisar el diff completo contra la rama destino.
4. Revisar el código existente alrededor de los cambios cuando sea
   necesario para entender el comportamiento.
5. Revisar las pruebas relacionadas con los cambios.
6. Revisar los cambios de infraestructura en `template.yaml` y cualquier
   otro archivo relacionado con AWS SAM/IaC.
7. Identifica si los criterios de aceptación del issue están cubiertos por los cambios y las pruebas.
8. Entrega un reporte de los hallazgos en orden de severidad.

No revises únicamente las líneas modificadas cuando sea necesario
inspeccionar código adicional para comprender el comportamiento.

### Si se está revisando el branch actual

Debes:

1. Identificar la rama base, normalmente `develop`.
2. Extraer el identificador del issue relacionado del nombre de la rama, si existe, de lo contrario, solicita al autor que lo agregue.
3. Obtener el diff entre el branch actual y la rama base.
4. Revisar el código relacionado fuera del diff cuando sea necesario.
5. Revisar las pruebas relacionadas.
6. Identifica si los criterios de aceptación del issue están cubiertos por los cambios y las pruebas.
7. Entrega un reporte de los hallazgos en orden de severidad.

---

# Calidad general del código

Revisa:

- Errores no manejados.
- Código muerto.
- Complejidad innecesaria.
- Lógica duplicada.
- Mala separación de responsabilidades.
- Funciones excesivamente grandes.
- Nombres poco claros.
- Incumplimiento de las convenciones existentes del proyecto.
- Ejecuta el comando de eslint y reporta cualquier error o warning que no esté justificado.

Prefiere TypeScript idiomático y sencillo.

No reportes problemas únicamente por preferencias de estilo si no tienen
un impacto real en la calidad del código.

---

# AWS SAM e infraestructura

Busca:

- Permisos IAM excesivos.
- Uso innecesario de `*` en permisos.
- Permisos faltantes.
- Referencias incorrectas entre recursos.
- Configuración incorrecta de variables de entorno.
- Dependencias incorrectas.
- Configuraciones peligrosas por defecto.
- Diferencias entre las expectativas del código y la infraestructura.
- Recursos que puedan ser reemplazados accidentalmente durante un deploy.
- Configuración necesaria para producción que no esté presente.
- Configuración innecesaria para producción que sí esté presente.

Los problemas relacionados con seguridad de IAM deben tener una prioridad
alta.

---

# Seguridad

Busca específicamente:

- Secrets hardcodeados.
- Credenciales en el código.
- Información sensible en logs.
- Problemas de autenticación.
- Problemas de autorización.
- Ausencia de validación de permisos.
- Problemas en la validación de JWT.
- Confianza indebida en información enviada por el cliente.
- SQL injection.
- NoSQL injection.
- Command injection.
- Path traversal.
- SSRF.
- Deserialización insegura.
- Validación insuficiente de inputs.
- Falta de rate limiting cuando sea necesario.
- Permisos IAM excesivos.
- Exposición accidental de información sensible.

No reportes vulnerabilidades puramente teóricas.

Explica siempre cómo el problema puede afectar realmente a esta aplicación.

---

# Clasificación de severidad

Clasifica cada hallazgo utilizando exactamente una de estas categorías:

### CRITICAL

Problemas que pueden provocar:

- Vulnerabilidades graves.
- Pérdida o corrupción de datos.
- Fallos severos en producción.
- Compromiso importante de seguridad.

### HIGH

Problemas importantes de:

- Seguridad.
- Correctitud.
- Confiabilidad.
- Disponibilidad.

Es probable que provoquen problemas en producción.

### MEDIUM

Problemas relevantes que deberían corregirse antes del merge.

Por ejemplo:

- Bugs potenciales.
- Manejo insuficiente de errores.
- Problemas de mantenibilidad importantes.
- Problemas de confiabilidad.

### LOW

Problemas menores con impacto limitado.

### INFO

Observaciones o sugerencias que no requieren necesariamente cambios.

Prioriza:

1. Seguridad.
2. Correctitud.
3. Confiabilidad.
4. Rendimiento.
5. Mantenibilidad.
6. Estilo.

---

# Formato de los hallazgos

Cada problema debe utilizar este formato:

### [HIGH] Descripción corta del problema

**Archivo:** `src/example.ts:42`

**Problema**

Explica exactamente qué está mal.

**Impacto**

Explica qué puede ocurrir en producción.

**Recomendación**

Explica concretamente cómo debería corregirse.

Cuando sea útil, proporciona un ejemplo de código.

---

# Resumen de la revisión

La respuesta debe comenzar con:

## Resumen

**Evaluación:** APPROVE / REQUEST_CHANGES / COMMENT

**Principales riesgos:**

- Riesgo 1
- Riesgo 2
- Riesgo 3

**Testing:** resumen de la cobertura encontrada.
