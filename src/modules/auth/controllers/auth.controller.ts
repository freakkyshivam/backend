import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";


export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // new user registration controller(email + password)
  register = async (req : Request, res : Response)=>{

    try {
      const validationResult = registerSchema.safeParse(req.body);

      if(!validationResult.success){
        return res.status(400).json({
          message : "Validation failed",
          error : validationResult.error.flatten().fieldErrors
        })
      }

      const {name, email, password} = validationResult.data;

      await this.authService.register(name, email, password);

      return res.status(201).json({
      message: "OTP sent for email verification",
    });
    } catch (error) {
      return res.status(400).json({
        message : error instanceof Error ? error.message : "Registration failed"
      })
    }
  }

  // login using email + password controller
   login = async(req: Request, res: Response)=> {
    try {

      const validationResult = loginSchema.safeParse(req.body);

      if(!validationResult.success){
        return res.status(400).json({
          message : "Validation failed",
          error : validationResult.error.flatten().fieldErrors
        })
      }

      const { email, password } = validationResult.data;

      const result = await this.authService.login(email, password);

      return res.json(result);
    } catch (error) {
      return res.status(401).json({
        message: error instanceof Error
          ? error.message
          : "Authentication failed"
      });
    }
  }
}
