export type Transfer = {
  id: number
  amount: number // paisa
  senderId: number
  receiverId: number
  sender: {
    id: number,
    username: string,
    email: string
  }
  receiver: {
    id: number,
    username: string,
    email: string
  }
  status: 'Processing' | 'Success' | 'Failed'
  createdAt: string // ISO
}

export type OnRampTransaction = {
  id: number
  amount: number // paisa
  provider: string
  startTime: string // ISO
  status: 'Success' | 'Failure' | 'Processing'
}
