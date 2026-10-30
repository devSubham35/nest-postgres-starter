import { QueryMonitorDto } from './dto/query-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class MonitorService {

  constructor(private readonly prisma: PrismaService) { }

  /////////////////////////////////////////////
  /// Create Monitor endpoint
  /////////////////////////////////////////////

  async create(userId: string, createMonitorDto: CreateMonitorDto) {
    return await this.prisma.monitor.create({
      data: {
        ...createMonitorDto,
        userId
      }
    })
  }

  /////////////////////////////////////////////
  /// Find all Monitor endpoint
  /////////////////////////////////////////////

  async findAll(userId: string, query: QueryMonitorDto) {

    const { page = 1, limit = 10, isActive, search, sortBy = "createdAt" } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [monitors, total] = await this.prisma.$transaction([
      this.prisma.monitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: 'desc',
        },
      }),
      this.prisma.monitor.count({ where }),
    ]);

    return {
      results: monitors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /////////////////////////////////////////////
  /// Find one Monitor endpoint
  /////////////////////////////////////////////

  async findOne(userId: string, id: string) {
    const data = await this.prisma.monitor.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!data) {
      throw new NotFoundException("Failed to find monitor endpoint")
    }

    return data
  }

  /////////////////////////////////////////////
  /// Update Monitor endpoint
  /////////////////////////////////////////////

  async update(userId: string, id: string, updateMonitorDto: UpdateMonitorDto) {

    await this.findOne(userId, id)

    return await this.prisma.monitor.update({
      where: {
        id,
        userId,
      },
      data: updateMonitorDto
    })
  }

  /////////////////////////////////////////////
  /// Remove Monitor endpoint
  /////////////////////////////////////////////

  async remove(userId: string, id: string) {

    await this.findOne(userId, id)

    return await this.prisma.monitor.delete({
      where: {
        id,
        userId,
      }
    })
  }
}
