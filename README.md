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

## Entorno local

El entorno local usa Docker para ejecutar DynamoDB Local y LocalStack. Estos
servicios son la base del desarrollo local; la Lambda Authorizer no emula
Cognito.

El comando `sam:local` carga las variables de Lambda desde
`sam-env.json` mediante la opción `--env-vars` de SAM. El archivo contiene
únicamente valores locales no sensibles.

```bash
npm run local:up
npm run local:setup
npm run local:seed
npm run sam:local
```

Los servicios quedan disponibles en `http://localhost:8000` (DynamoDB Local) y
`http://localhost:4566` (LocalStack). La API SAM queda disponible en
`http://127.0.0.1:3000`.

Los comandos `local:setup` y `local:seed` son idempotentes. Para detener los
servicios sin eliminar sus volúmenes usa:

```bash
npm run local:down
```

La configuración local usa `ENVIRONMENT=local`. La authorizer local devuelve
una identidad fija de pruebas (`subject=test`, `test@example.com`, `Test User`)
para que SAM Local pueda ejecutar las rutas protegidas sin Cognito. Esta
identidad no representa un sistema de autenticación y no debe usarse fuera del
entorno local.

La Lambda Authorizer está registrada en API Gateway para las rutas protegidas
que se añadan posteriormente. En local el header no se utiliza para seleccionar
un usuario:

```http
Authorization: Bearer local-test-token
```

La authorizer devuelve la identidad en el contexto de API Gateway. `/health`
permanece público y no usa la authorizer.

En AWS se usa `ENVIRONMENT=dev` o `ENVIRONMENT=prod`, junto con
`AUTH_MODE=cognito`, `COGNITO_USER_POOL_ID` y `COGNITO_CLIENT_ID`. La
authorizer valida el JWT con Cognito antes de resolver la identidad. No se
deben guardar credenciales reales en `.env` ni en el repositorio.

Si un puerto está ocupado, cambia el mapeo correspondiente en
`docker-compose.yml` y actualiza la configuración de los scripts. Si SAM no
puede conectarse a los servicios desde el contenedor Lambda, revisa la red de
Docker y el endpoint configurado por los clientes locales.

La compilación usa esbuild a través de AWS SAM. El typecheck se ejecuta por separado con `tsc --noEmit` y las pruebas usan Jest directamente sobre los archivos TypeScript.

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
