import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("users")
export class Users extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("text")
  email!: string;

  @Field()
  @Column("text")
  firstName!: string;

  @Field()
  @Column("text")
  lastName!: string;

  @Field()
  @Column("text")
  username!: string;

  @Column("text")
  password!: string;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
