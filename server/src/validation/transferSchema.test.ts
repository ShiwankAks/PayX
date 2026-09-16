import {describe, it, expect } from 'vitest'
import { transferSchema } from './transfer.schema.js'

describe("transferSchema",()=>{
    it("accepts a valid transfer",()=>{
        const input = {
            receiverId:2,
            value:100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(true)
    })

    it("rejects a invalid receiverId",()=>{
        const input = {
            receiverId: 0,
            value:100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects a non positive value",()=>{
        const input= {
            receiverId:1,
            value:0
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects non integer receiverId",()=>{
        const input={
            receiverId:1.5,
            value:100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects non integer value",()=>{
        const input={
            receiverId:1,
            value:100.5
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects negative value",()=>{
        const input={
            receiverId:1,
            value:-100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
    
    it("rejects negative receiverId",()=>{
        const input={
            receiverId:-1,
            value:100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
    
    it("rejects missing receiverId",()=>{
        const input={
            value:100
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    
    it("rejects missing value",()=>{
        const input={
            receiverId:2
        }
        const result = transferSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
})



