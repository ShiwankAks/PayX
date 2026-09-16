import { describe, it , expect } from 'vitest'
import { loginSchema, signupSchema } from './auth.schema.js'


describe("authSchema",()=>{

    describe('signupSchema', () => {
        it("accepts a valid signup",()=>{
            const input = {
                email:"Hi@gmail.com",
                phone:"9874563210",
                username:"Om123",
                password:"123456789"
            }
            const result = signupSchema.safeParse(input)
            expect(result.success).toBe(true)
        })

        it("rejects invalid email",()=>{
            const input = {
                email:"Higmailcom",
                phone:"9874563210",
                username:"Om123",
                password:"123456789"
            }
            const result = signupSchema.safeParse(input)
            expect(result.success).toBe(false)
        })

        it("rejects phone less 10",()=>{
            const input = {
                email:"Hi@gmail.com",
                phone:"98745632",
                username:"Om123",
                password:"123456789"
            }
            const result = signupSchema.safeParse(input)
            expect(result.success).toBe(false)
        })

        it("rejects phone more than 10",()=>{
            const input = {
                email:"Hi@gmail.com",
                phone:"987456003210",
                username:"Om123",
                password:"123456789"
            }
            const result = signupSchema.safeParse(input)
            expect(result.success).toBe(false)
        })
        
        it("rejects password less than 8",()=>{
            const input = {
                email:"Hi@gmail.com",
                phone:"9874563210",
                username:"Om123",
                password:"1456789"
            }
            const result = signupSchema.safeParse(input)
            expect(result.success).toBe(false)
        })

     })

    describe('loginSchema', () => { 
        it("accepts a valid login",()=>{
            const input={
                email:"hi@gmail.com",
                password:"123456789"
            }
            const result = loginSchema.safeParse(input)
            expect(result.success).toBe(true)
        })

         it("rejects invalid email",()=>{
            const input = {
                email:"Higmailcom",
                password:"123456789"
            }
            const result = loginSchema.safeParse(input)
            expect(result.success).toBe(false)
        })

        it("rejects missing email",()=>{
            const input = {
                password:"123456789"
            }
            const result = loginSchema.safeParse(input)
            expect(result.success).toBe(false)
        })

        it("rejects missing password",()=>{
            const input = {
                email:"Higmailcom",
            }
            const result = loginSchema.safeParse(input)
            expect(result.success).toBe(false)
        })
     })
})