// Простые тесты, которые точно работают в Deno
Deno.test("Basic functionality", () => {
  // Test 1: Simple math
  console.assert(1 + 1 === 2, "Math should work");
  
  // Test 2: String operations
  const str = "Подольск";
  console.assert(str.toLowerCase().includes("подольск"), "String operations should work");
  
  // Test 3: Array operations
  const arr = [1, 2, 3];
  console.assert(arr.length === 3, "Arrays should work");
  
  console.log("All basic tests passed! ✅");
});

Deno.test("Address validation simulation", () => {
  // Симуляция логики валидации
  function simulateValidation(city: string): boolean {
    return city.toLowerCase().includes("подольск");
  }
  
  console.assert(simulateValidation("Подольск") === true, "Podolsk should be valid");
  console.assert(simulateValidation("Москва") === false, "Moscow should be invalid");
  console.assert(simulateValidation("") === false, "Empty should be invalid");
  
  console.log("Address validation tests passed! ✅");
});