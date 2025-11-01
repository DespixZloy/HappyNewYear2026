Deno.test("Basic math test", () => {
  const result = 2 + 2;
  if (result !== 4) {
    throw new Error(`Expected 4, got ${result}`);
  }
});

Deno.test("String test", () => {
  const str = "hello";
  if (str !== "hello") {
    throw new Error("String should be 'hello'");
  }
});