import Bottle from './Bottle';
import Message from './Message';

class Database {
  constructor() {
    console.log('[Database.js] Constructing database');

    this.bottle = new Bottle();

    /**
     * Mock some messages into our bottle
     */
    const message0 = new Message(0, `I'm here for a long time...
      I'm the first message of this bottle...`);

    const message1 = new Message(1, 'A second message?? Yes.');

    const message2 = new Message(2, `Pirates should never left
      messages behind... But I don't care!`);

    const message3 = new Message(3, `This is a nice island, if
      you find this bottle, keep that in mind`);

    this.bottle.addMessage(message0);
    this.bottle.addMessage(message1);
    this.bottle.addMessage(message2);
    this.bottle.addMessage(message3);
  }

  /**
   * This function will be called by GraphQL.
   * It receives a text string, creates a new Message instance and insert it to
   * our Bottle.
   */
  insertMessage(text) {
    const newId = this.bottle.findHighestId() + 1;
    const message = new Message(newId, text);

    this.bottle.addMessage(message);
    return message;
  }

  /**
   * This function will be called by GraphQL.
   * It returns all messages of the Bottle.
   */
  getMessages() {
    const messages = this.bottle.getMessages();
    return messages;
  }

  /**
   * This function will be called by GraphQL.
   * It returns a message by id.
   */
  getMessageById(messageId) {
    const messages = this.bottle.getMessages();
    return messages[messageId];
  }

  /**
   * This function will be called by GraphQL.
   * It returns the whole Bottle.
   */
  getBottle() {
    return this.bottle;
  }

  /**
   * This function will be called by GraphQL.
   * It removes a message based on messageId.
   */
  removeMessageById(messageId) {
    this.bottle.removeMessageById(messageId);
    const messages = this.getMessages();
    return messages;
  }
}

export default Database;
