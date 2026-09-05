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

## Infraestructura SAM

El archivo `template.yaml` define la infraestructura base:

- HTTP API Gateway con el endpoint `GET /health`.
- Lambda `HealthFunction` compilada con esbuild.
- Tabla DynamoDB On-Demand con claves `PK` y `SK`.
- Bucket S3 privado y cifrado para fotografías.

Los parámetros `ProjectName`, `EnvironmentName` y `ApiStageName` permiten reutilizar el template en distintos ambientes. Los nombres físicos de DynamoDB y S3 los genera CloudFormation para evitar colisiones entre stacks.

Los outputs del stack exponen la URL base de la API, la URL de health y los nombres de la tabla y del bucket. No se exportan secretos ni credenciales.

## CI

El workflow de GitHub Actions se ejecuta automáticamente en cada Pull Request y valida lint, typecheck, tests, `sam validate` y `sam build`.

Versiones fijadas para CI:

- Node.js 24.20.0
- AWS SAM CLI 1.165.0

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
