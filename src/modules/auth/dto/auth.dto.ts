import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {

  @IsString()
  @IsNotEmpty()
  name!: string;


  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SignInDto {

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
