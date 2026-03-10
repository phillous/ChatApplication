import { Expose } from "class-transformer";

export class loginResponseDto {
    @Expose()
    fullName: string;

    @Expose()
    email: string;

    @Expose()
    profilePic: string;

    @Expose()
    token: string;
}