class User {
  constructor(userId) {
    console.log(`[User.js] Constructing a new User with userId: ${userId}`);
    this.id = userId; // This will be used by GraphQL.
    this.userId = userId; // This will be used by Database.
    this.phones = [];
  }

  /**
   * This function will be called by Database.js.
   * It inserts a Phone to User.
   */
  addPhone(phone) {
    console.log('[User.js] Adding Phone into User...');
    this.phones.push(phone);
  }

  /**
   * This function will be called by Database.js.
   * It returns the phones of the User.
   */
  getPhones() {
    return this.phones;
  }

  /**
   * This function will be called by Database.js.
   * It removes a phone based on phoneId.
   */
  removePhoneById(phoneId) {
    console.log(`[User.js] Removing Phone(PhoneId: ${phoneId}) from User...`);
    this.phones = this.phones.filter(phone => phone.phoneId !== phoneId);
  }
}

export default User;
