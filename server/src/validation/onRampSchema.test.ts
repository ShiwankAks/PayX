import {describe, it, expect } from 'vitest'
import { onRampSchema } from './onRamp.schema.js'

describe("onRampSchema",()=>{
    it("accepts a valid on-ramp transfer",()=>{
        const input = {
            amount:200,
            provider:"SBI"
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(true)
    })

    it("rejects an empty provider ",()=>{ 
        const input = {
            amount: 1000,
            provider:""
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects a non positive amount",()=>{
        const input= {
            amount: 0,
            provider:"sbi"
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects integer as provider",()=>{
        const input={
            amount: 1000,
            provider:100
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    it("rejects missing amount",()=>{
        const input={
            provider:"SBI"
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(false)
    })

    
    it("rejects missing provider",()=>{
        const input={
            amount: 1000,
        }
        const result = onRampSchema.safeParse(input)

        expect(result.success).toBe(false)
    })
})



