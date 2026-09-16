import {describe, it, expect } from 'vitest'
import { webhookSchema } from './webhook.schema.js'

describe("webhookSchema",()=>{
    it("accepts a valid transaction",()=>{
        const input = {
            token:"qwerty123",
            transactionId:23
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(true)
    })

    it("rejects token as number",()=>{
        const input = {
            token:123,
            transactionId:23
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects an empty token",()=>{
        const input= {
            token:"",
            transactionId:23
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects non integer transactionId",()=>{
        const input={
            token:"qwerty123",
            transactionId:23.5
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })


    it("rejects negative transactionId",()=>{
        const input={
            token:"qwerty123",
            transactionId:-23
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
    
    
    it("rejects missing token",()=>{
        const input={
            transactionId:23
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    
    it("rejects missing transactionId",()=>{
        const input={
            token:"qwerty123",
        }
        const result = webhookSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
})



