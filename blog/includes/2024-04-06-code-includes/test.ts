interface User {
    name: string;
    email: string;
    age: number;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  }
  
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      zip: "12345"
    }
  };
  
  console.log(user);