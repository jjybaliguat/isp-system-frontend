  export const generateAccountNumber = () => {
    const yearPrefix = new Date().getFullYear().toString().slice(2);
    const chars = "0123456789";
    let randomPart  = "";
    
    for (let i = 0; i < 10; i++) { // remaining 10 digits to make 12 total
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const result = yearPrefix + randomPart
    return result
  };