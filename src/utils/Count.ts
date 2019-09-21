import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class Count {
  @Field()
  count: number
}

export interface ICount {
  count: number
}