function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      const last = stack.pop();

      if (last !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}