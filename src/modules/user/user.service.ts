import { SignUpDto } from '../auth/dto/auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  /// Create user
  async create(body: SignUpDto) {

    try {
      return await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        }
      })

    } catch (error) {
      const ERROR_CODE = "P2002"

      const err = error as { code: string } 
      if(err.code = ERROR_CODE){
        throw new ConflictException("Email already exist")
      }

      throw error
    }
  }

  /// Find user by email
  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email
        }
      })

    } catch (error) {
      throw new BadRequestException("Invalid credentials / User not found")
    }
  }

  /// Find user by id
  async findById(id: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id
        }
      })

    } catch (error) {
      throw new BadRequestException("User not found or invalied user id")
    }
  }


  /// Find user by email
  async getAllUsers(name?: string) {
    return await this.prisma.user.findMany()
  }
}
