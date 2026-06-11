import {hash} from 'bcrypt-ts'
import { userTable } from '../../db/schema'

export default eventHandler(async (event) => {
    const { email, password, first_name, last_name } = await readBody(event);
    if(!email || !password|| !first_name || !last_name){
        throw createError({ statusCode:400 ,message:"All the data must be provided in data body." })
    }

    const hashedPassword = hash(password, 8);

    const db = useDrizzle()
    const insertResult = await db.insert(userTable).values({
        email,
        password: await hash(password, 8),
        firstName: first_name,
        lastName: last_name,
        role: 'patient',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })
    .returning()
    return { insertResult }
});