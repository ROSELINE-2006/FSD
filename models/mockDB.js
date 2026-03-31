const fs = require('fs');
const crypto = require('crypto');

class MockModel {
  constructor(name) {
    this.name = name;
    this.data = [];
  }

  async findOne(query) {
    return this.data.find(item => {
      let match = true;
      for (const key in query) {
        if (item[key] !== query[key]) match = false;
      }
      return match;
    }) || null;
  }

  async create(obj) {
    const newDoc = { ...obj, _id: crypto.randomBytes(12).toString('hex'), id: crypto.randomBytes(12).toString('hex'), createdAt: new Date(), updatedAt: new Date() };
    this.data.push(newDoc);
    return newDoc;
  }

  find(query) {
    // Return a chainable object for simple queries
    const results = this.data.filter(item => {
      let match = true;
      if (query) {
        for (const key in query) {
          if (item[key] !== query[key]) match = false;
        }
      }
      return match;
    });

    return {
      sort: () => this,
      populate: () => results,
      then: (resolve) => resolve(results),
      ...results
    };
  }
}

module.exports = {
  UserModel: new MockModel('User'),
  CertificateModel: new MockModel('Certificate'),
  VerificationLogModel: new MockModel('VerificationLog')
};
