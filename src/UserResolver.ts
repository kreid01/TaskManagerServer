import { Resolver, Query, Mutation, Arg} from 'type-graphql'
import { hash } from 'bcryptjs'
import { Users } from './Entities/Users';


@Resolver()
export class UserResolver {
    @Query(() => String) 
    hello() {
        return "hi!"
    }


@Mutation()
async register(
    @Arg("email") email: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("usernmae") username: string,
    @Arg("password") password: string,

) {

    const hashedPassword = await hash(password, 12);

    try {
        await Users.insert({
            firstName, lastName, username, password: hashedPassword
        })
    } catch (err) {
        console.log(err)
        return false
    }
}
}