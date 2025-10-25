export const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || 
         process.env.GEMINI_API_KEY || 
         'your-api-key-here';
};
