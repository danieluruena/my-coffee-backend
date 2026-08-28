# My Coffee Backend

Backend serverless de Mi Cafecito, construido con AWS SAM, Lambda, Node.js y TypeScript.

## Prerrequisitos

- Node.js 24.x o superior
- npm
- [AWS SAM CLI](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/install-sam-cli.html) para validar, compilar y ejecutar la función localmente
- [Docker](https://docs.docker.com/get-docker/) instalado y ejecutándose para invocar Lambda y levantar la API localmente con SAM

Instalar dependencias:

```bash
npm install
```

## Comandos

```bash
npm run typecheck
npm run lint
npm test
npm run sam:validate
npm run build
```

La compilación usa esbuild a través de AWS SAM. El typecheck se ejecuta por separado con `tsc --noEmit` y las pruebas usan Jest directamente sobre los archivos TypeScript.

Para invocar la Lambda localmente después del build:

```bash
sam local invoke HealthFunction
```

Los comandos `sam local` requieren que Docker esté instalado y ejecutándose.

Para iniciar el endpoint HTTP local:

```bash
npm run sam:local
```

El endpoint disponible será `GET http://127.0.0.1:3000/health`.
