import axios from "axios";

export const getConversationHistory =
async(conversationId)=>{

 // Return empty array if no conversationId (new conversation)
 if (!conversationId || conversationId === 'undefined') {
  return [];
 }

 try {
  const response = await axios.get(
   `${process.env.CHAT_SERVICE}/get-messages/${conversationId}`
  );

  return response.data;
 } catch (error) {
  console.error('Error fetching conversation history:', error.message);
  return [];
 }

};