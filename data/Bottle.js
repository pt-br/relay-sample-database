class Bottle {
  constructor() {
    console.log(`[Bottle.js] Constructing a new bottle`);
    this.messages = [];
  }

  /**
   * This function will be called by Database.js.
   * It inserts a Message into our Bottle.
   */
  addMessage(message) {
    console.log('[Bottle.js] Adding message into the bottle...');
    this.messages.push(message);
  }

  /**
   * This function will be called by Database.js.
   * It returns the messages of the Bottle.
   */
  getMessages() {
    return this.messages;
  }

  /**
   * This function will be called by Database.js.
   * It returns the highest message id on the Bottle. - We use this to set the
   * id for new messages being added.
   */
  findHighestId() {
    let highestId = 0;
    this.messages.filter(message => {
      if (message.messageId > highestId) {
        highestId = message.messageId;
      }

      return message;
    });
    return highestId;
  }

  /**
   * This function will be called by Database.js.
   * It removes a message based on messageId.
   */
  removeMessageById(messageId) {
    this.messages = this.messages.filter(message => message.messageId !== messageId);
  }
}

export default Bottle;
