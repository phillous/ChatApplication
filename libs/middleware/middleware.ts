import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, NextFunction} from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private jwtService: JwtService){}

    async use(req: Request, res: Response, next: NextFunction){
        const {token} = req.signedCookies;

        if(!token){
            throw new BadRequestException("Invalid Token")
        }
        const payload = await this.jwtService.decode(token)
        const {_id} = payload
        
        req.user = {_id};

        
        next();
    }
}