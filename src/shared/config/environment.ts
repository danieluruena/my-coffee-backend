export type AuthMode = 'mock' | 'cognito'
const Environment = {
  LOCAL: 'local',
  DEV: 'dev',
  PROD: 'prod',
} as const

export type Environment = (typeof Environment)[keyof typeof Environment]

export interface EnvironmentConfig {
  environment: Environment
  awsRegion: string
  tableName: string
  bucketName: string
  cognitoUserPoolId: string
  cognitoClientId: string
  isLocalEnv: boolean
}

const requiredEnvironment = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const loadEnvironment = (): EnvironmentConfig => {
  return {
    environment: requiredEnvironment('ENVIRONMENT', process.env.ENVIRONMENT) as Environment,
    awsRegion: requiredEnvironment('AWS_REGION', process.env.AWS_REGION),
    tableName: requiredEnvironment('TABLE_NAME', process.env.TABLE_NAME),
    bucketName: requiredEnvironment('BUCKET_NAME', process.env.BUCKET_NAME),
    cognitoUserPoolId: requiredEnvironment('COGNITO_USER_POOL_ID', process.env.COGNITO_USER_POOL_ID),
    cognitoClientId: requiredEnvironment('COGNITO_CLIENT_ID', process.env.COGNITO_CLIENT_ID),
    isLocalEnv: process.env.ENVIRONMENT as Environment === Environment.LOCAL,
  }
}
