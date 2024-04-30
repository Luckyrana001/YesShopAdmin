// Function to generate a random request ID
export const generateRequestId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${random}`;
};

// Function to generate random IDs
export function generateRandomId() {
  return "_" + Math.random().toString(36).substr(2, 9); // Generating a random string
}
