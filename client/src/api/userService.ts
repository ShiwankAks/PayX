import { apiClient } from "./apiClient"


export const userService={
    getTransfers : async(limit?:number)=>{
        const res = await apiClient.get("/transfer/transfer-history",{
            params:{limit}
        })
        return res
    },
    getOnrampTransactions: async (limit?:number) => {
        const res = await apiClient.get("/wallet/on-ramp-transactions",{
            params:{limit}
        })
        return res
    },
    addMoney:async(amount:number, provider:string )=>{
        const res = await apiClient.post("/wallet/add-money",{
            amount, provider
        })
        return res
    },
    sendMoney:async(value:number, receiverId:number)=>{
        const res = await apiClient.post("/transfer/transfer-balance",{value, receiverId})
        return res
    },
    getReceivers:async () => {
        const res = await apiClient.get("/transfer/users")
        return res
    }

}