import { PrismaClient, User } from '@prisma/client'
import { CreateUserData, UpdateUserData, UserWithStats } from '../types/user'

export interface IUserRepository {
  findById(userId: number): Promise<UserWithStats | null>
  findByEmail(email: string): Promise<User | null>
  findByGoogleId(googleId: string): Promise<User | null>
  create(userData: CreateUserData): Promise<User>
  update(userId: number, userData: UpdateUserData): Promise<User>
  delete(userId: number): Promise<void>
  findActiveUsers(): Promise<User[]>
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(userId: number): Promise<UserWithStats | null> {
    return this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        _count: {
          select: {
            publications: true,
            comments: true,
            reports_made: true
          }
        },
        statistics: true
      }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { google_id: googleId }
    })
  }

  async create(userData: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: userData
    })
  }

  async update(userId: number, userData: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: userData
    })
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { 
        status: 'deleted',
        active: false 
      }
    })
  }

  async findActiveUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { 
        active: true,
        status: 'active'
      },
      orderBy: { registration_date: 'desc' }
    })
  }

}