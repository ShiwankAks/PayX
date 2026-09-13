

export const getGreeting = ()=>{
    const hours = new Date().getHours()
    if(hours<12) return "Good Morning"
    if(hours<15) return "Good Afternoon"
    return "Good Evening"
}