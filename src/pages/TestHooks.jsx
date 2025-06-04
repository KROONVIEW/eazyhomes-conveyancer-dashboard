import React, { useState } from 'react';

export default function TestHooks() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)} style={{fontSize: 24, padding: 16, margin: 32}}>
      Count: {count}
    </button>
  );
} 