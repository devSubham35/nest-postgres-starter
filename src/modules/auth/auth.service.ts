import bcrypt from "bcrypt"
import { User } from "src/generated/prisma/client";
import { UserService } from "../user/user.service";
import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { AuthenticatedUser } from "src/common/common.types";
import { TokenService } from "src/common/services/token.service";
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

  /// Format user response without password
  private toTokenPayload(user: User): AuthenticatedUser {
    return {
      sub: user.id.toString(),
      email: user.email,
    };
  }

  /// Signup Service
  async signup(signupDto: SignUpDto) {

    const hashedPassword = await bcrypt.hash(signupDto.password, 10)

    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword
    })


    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(user)
    )

    return {
      data: { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        accessToken 
      },
      message: "Signup Successfully"
    }
  }

  /// Signin Service
  async signin(body: SignInDto) {

    const existingUser = await this.userService.findByEmail(body.email)

    if (!existingUser) {
      throw new BadRequestException("User not found")
    }

    const isPasswordMatched = await bcrypt.compare(body.password, existingUser.password)

    if (!isPasswordMatched) {
      throw new BadRequestException("Invalid credentials")
    }

    const { password, ...userResponse } = existingUser;

    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(existingUser)
    )

    return {
      data: { user: userResponse, accessToken },
      message: "Signin Successfully"
    }

  }

  /// User profile service
  async profile(id: string) {
    const user = await this.userService.findById(id)

    if (!user) {
      throw new BadRequestException("User not found")
    }
    const { password, ...passwordLessUser } = user

    return {
      data: passwordLessUser,
      message: "Profile fetched succesfully"
    }
  }
}
