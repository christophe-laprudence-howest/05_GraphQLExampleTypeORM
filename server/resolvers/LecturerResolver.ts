import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { getMongoManager, MongoEntityManager } from 'typeorm'
import { Lecturer } from '../entities/LecturerEntity'

@Resolver()
export class LecturerResolver {
  manager: MongoEntityManager = getMongoManager('mongodb')

  @Query(() => [Lecturer], { nullable: true })
  async getLecturers(): Promise<Lecturer[]> {
    return await this.manager.find<Lecturer>(Lecturer)
  }

  @Query(() => [Lecturer], { nullable: true })
  async getLecturerById(
    @Arg('id') id: string,
  ): Promise<Lecturer | undefined | null> {
    return await this.manager.findOne<Lecturer>(Lecturer, id)
  }

  @Mutation(() => Lecturer, { nullable: true })
  async createLecturer(
    @Arg('data') newLecturerData: Lecturer,
  ): Promise<Lecturer> {
    const lecture: Lecturer = await this.manager.create(
      Lecturer,
      newLecturerData,
    )
    this.manager.save(lecture)
    return lecture
  }

  @Mutation(() => String)
  async deleteLecturer(@Arg('id') id: string): Promise<string> {
    try {
      const lecturer: Lecturer | undefined = await this.manager.findOne(
        Lecturer,
        id,
      )

      if (lecturer) {
        await this.manager.delete(Lecturer, id)
        return id
      }
    } catch (error) {
      throw new Error(`Failed to delete lecture with id ${id}.` + error)
    }
  }
}
