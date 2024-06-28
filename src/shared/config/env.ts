import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, NotEquals, validateSync } from "class-validator";

class Env {
    @IsString()
    @IsNotEmpty()
    dbURL: string;

    @IsString()
    @IsNotEmpty()
    @NotEquals('unsecure_jwt_secret')
    jwtSecret: string;

    @IsString()
    chargeExpiresIn: string;

    @IsString()
    @IsNotEmpty()
    @NotEquals('unsecure_jwt_secret')
      resetPasswordJwtSecret: string
  
    @IsString()
    @IsNotEmpty()
      emailUser: string
  
    @IsString()
    @IsNotEmpty()
      emailPassword: string
  
    @IsString()
    @IsNotEmpty()
      frontendUrl: string

    @IsString()
    @IsNotEmpty()
      paymentAuthToken: string;
}

export const env: Env = plainToInstance(Env, {
    dbURL: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    chargeExpiresIn: process.env.CHARGE_EXPIRES_IN,
    resetPasswordJwtSecret: process.env.RESET_PASSWORD_JWT_SECRET,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    frontendUrl: process.env.FRONTEND_URL,
    paymentAuthToken: process.env.PAYMENT_AUTH_TOKEN
});

const errors = validateSync(env);

if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
}