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
    }

}