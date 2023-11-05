import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const requiredEnvVars = [
    "OWNER_PKEY",
    "INFRA_RPC_URL",
    "FACTCHAIN_CONTRACT_ADDRESS",
  ];
  for (const requiredEnvVar of requiredEnvVars) {
    if (!process.env[requiredEnvVar])
      throw Error(`Env var ${requiredEnvVar} is required but not set`);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
