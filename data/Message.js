class Message {
  constructor(messageId, text) {
    console.log(`[Message.js] Constructing a new message with messageId: ${messageId}`);
    this.id = messageId; // Used for globalIdField on GraphQL
    this.messageId = messageId; // Used for Database manipulation
    this.text = text;
  }
}

export default Message;
