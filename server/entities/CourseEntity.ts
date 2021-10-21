import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Lecturer } from './LecturerEntity'
@ObjectType()
@InputType('CoursesInput')
@Entity('Courses')
export class Course extends BaseEntity {
  @Field(() => ID, { nullable: true }) //Field decorator, represent a Graphql field of our graphql object type
  @ObjectIdColumn() //Special decorator, to tell that this collumn represent an unique generated ID
  id?: ObjectID
  @Field()
  @Column()
  title: string
  @Field({ nullable: true })
  @Column()
  stars?: number
  @Field({ nullable: true })
  @Column()
  sem?: number
  @Field({ nullable: true })
  @Column()
  option?: string
  @Field({ nullable: true })
  @Column({ default: false })
  favorite?: boolean
  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt?: Date
  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date
  @Field(type => [Lecturer], { nullable: true })
  @Column(type => Lecturer)
  lecturers: Lecturer[]
}


@InputType('CreateCoursesInput')
@Entity('Courses')
export class CreateCoursesInput extends Course {
  @Field(type => [CoursesLectorInput], { nullable: true })
  @Column(type => Lecturer)
  lecturers: Lecturer[]
}

@InputType('CreateCoursesLectorInput')
export class CoursesLectorInput {
  @Field()
  name: string
  @Field()
  language: string
}
