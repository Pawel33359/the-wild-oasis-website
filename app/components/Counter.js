"use client";

import { useState } from "react";

function Counter({ users }) {
  const [count, setCount] = useState(0);

  console.log("Users in Counter:", users);

  return (
    <div>
      <p>Number of users: {users.length}</p>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  );
}

export default Counter;
