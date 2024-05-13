import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "../users/users.dto";

export class LoginUserDto extends PickType(CreateUserDto, [
    'email',
    'password'
])  {}