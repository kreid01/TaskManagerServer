import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("taks")
export class Tasks extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column("int")
  creator: number;

  @Field(() => Int)
  @Column("int")
  projectId?: number;

  @Field(() => Int)
  @Column("int")
  teamId?: number;

  @Field(() => String)
  @Column("text")
  taskName: string;

  @Field(() => String)
  @Column("text")
  completeDate: string;

  @Field(() => Boolean)
  @Column("boolean")
  isComplete: boolean;

  @Field(() => String)
  @Column("text")
  created: string;
}
