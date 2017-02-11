import User from './User';
import Phone from './Phone';
import ShortId from 'shortid';

class Database {
  constructor() {
    console.log('[Database.js] Constructing database');

    const userId = ShortId.generate();
    this.user = new User(userId);

    /**
     * Mock some phones into user
     */
    this.insertPhone('iPhone 6', 'https://goo.gl/ndJdW9');
    this.insertPhone('Galaxy S7', 'https://goo.gl/uanrHM');
  }

  /**
   * This function will be called by GraphQL.
   * It receives a text string, creates a new Phone instance and insert it to
   * our User.
   */
  insertPhone(model, image) {
    const phoneId = ShortId.generate();
    const phones = this.getPhones();

    const idIsUnique = this.checkUniqueId(phoneId, phones);

    if (!idIsUnique) {
      this.insertPhone(model);
      return false;
    }

    const phone = new Phone(phoneId, model, image);

    this.user.addPhone(phone);
    return phone;
  }

  /**
   * This function will be called by GraphQL.
   * It returns all phones of the User.
   */
  getPhones() {
    const phones = this.user.getPhones();
    return phones;
  }

  checkUniqueId(newId, phones) {
    let isUnique = true;

    if (phones.length > 0) {
      phones.map(({ phoneId }) => {
        if (phoneId === newId) {
          isUnique = false;
        }
      }, newId);
    }

    return isUnique;
  }

  /**
   * This function will be called by GraphQL.
   * It returns a phone by phoneId.
   */
  getPhoneById(phoneId) {
    const phones = this.user.getPhones();
    const selectedPhone = phones.filter(phone => phone.phoneId == phoneId);
    return selectedPhone;
  }

  /**
   * This function will be called by GraphQL.
   * It returns the whole User.
   */
  getUser() {
    return this.user;
  }

  /**
   * This function will be called by GraphQL.
   * It removes a phone based on phoneId.
   */
  removePhoneById(phoneId) {
    this.user.removePhoneById(phoneId);
    const phones = this.getPhones();
    return phones;
  }
}

export default Database;
