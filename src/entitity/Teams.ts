import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("teams")
export class Teams extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column("int")
  teamLead: number;

  @Field(() => String)
  @Column("text")
  teamName: string;

  @Field(() => String)
  @Column("text")
  members: string;

  @Field(() => String)
  @Column("text")
  created: string;
}
