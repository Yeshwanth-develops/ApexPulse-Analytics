// Test file to diagnose Races API issues
// Run this in browser console or Node

const testRacesAPI = async () => {
  try {
    console.log("=== Testing Races API ===");
    
    // Test 1: Basic API call
    console.log("\nTest 1: Calling /api/races...");
    const response = await fetch("http://localhost:5000/api/races");
    console.log("Response status:", response.status);
    console.log("Response OK:", response.ok);
    
    // Test 2: Parse JSON
    const data = await response.json();
    console.log("Response data structure:", Object.keys(data));
    console.log("Response:", data);
    
    // Test 3: Check races array
    console.log("\nTest 3: Races array check");
    console.log("Has races property:", "races" in data);
    console.log("races is array:", Array.isArray(data.races));
    console.log("races length:", data.races?.length);
    
    // Test 4: Check first race structure
    if (data.races && data.races.length > 0) {
      console.log("\nTest 4: First race structure");
      const firstRace = data.races[0];
      console.log("First race:", firstRace);
      console.log("Race fields:", Object.keys(firstRace));
      
      // Test required fields
      console.log("\nTest 5: Required fields check");
      console.log("Has date:", "date" in firstRace, firstRace.date);
      console.log("Has raceName:", "raceName" in firstRace, firstRace.raceName);
      console.log("Has round:", "round" in firstRace, firstRace.round);
      console.log("Has Circuit:", "Circuit" in firstRace);
      if (firstRace.Circuit) {
        console.log("Has Circuit.Location:", "Location" in firstRace.Circuit);
        console.log("Has Location.locality:", firstRace.Circuit.Location?.locality);
        console.log("Has Location.country:", firstRace.Circuit.Location?.country);
      }
    }
    
    console.log("\n=== Test Complete ===");
    return data;
  } catch (error) {
    console.error("=== API Test Failed ===");
    console.error("Error:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
};

// Usage: testRacesAPI().then(data => console.log("Final data:", data));
export default testRacesAPI;
