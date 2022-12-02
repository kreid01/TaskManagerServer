import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("projects")
export class Projects extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column("int")
  projectLead: number;

  @Field(() => String)
  @Column("text")
  projectName: string;

  @Field(() => String)
  @Column("text")
  completeDate: string;

  @Field(() => String)
  @Column("text")
  members: string;

  @Field(() => Boolean)
  @Column("boolean")
  isComplete: boolean;

  @Field(() => String)
  @Column("text")
  created: string;
}
