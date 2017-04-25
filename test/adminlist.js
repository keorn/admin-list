var AdminList = artifacts.require("../contracts/AdminList.sol");

// testrpc --account 0xe00a3d4e0ed5638fde85df50739f767c7d85d72a7d1a5548f21ed7f0d05b90c1,99999999999999999999 --account 0xb8b9b0006a8a353836aa296af16b1c92aa0a2b0569d1d7fb1fac7f25dbbccba2,99999999999999999999 --account 0x9856d83361e3ef6f594f25ee471416cf6a7d1c55fe777f42597243c0aa2c8fa9,99999999999999999999

contract('AdminList', function(accounts) {
  it("should contain the first validator", function() {
    return AdminList.deployed().then(function(instance) {
      return instance.getValidators.call();
    }).then(function(list) {
      assert.equal(list.valueOf()[0], accounts[0], "incorrect validators");
    });
  });

  it("admin can manage validators", function() {
    var validators;
    return AdminList.deployed().then(function(instance) {
      validators = instance;
      return validators.addValidator(accounts[1]);
    }).then(function(result) {
      assert.equal(result.logs[0].event, "ValidatorsChanged", "validator alteration log not present");
      return validators.getValidators.call();
    }).then(function(list) {
      assert.equal(list.valueOf()[1], accounts[1], "second validator not present");
      return validators.removeValidator(accounts[1]);
    }).then(function(result) {
      assert.equal(result.logs[0].event, "ValidatorsChanged", "validator alteration log not present");
      return validators.getValidators.call();
    }).then(function(list) {
      assert.equal(list.valueOf().length, 1, "unexpected number of validators");
      assert.equal(list.valueOf()[0], accounts[0], "first validator not present");
    });
  });

  it("admin can manage admins", function() {
    var validators;
    return AdminList.deployed().then(function(instance) {
      validators = instance;
      return validators.addAdmin(accounts[2]);
    }).then(function() {
      return validators.isAdmin.call(accounts[2]);
    }).then(function(bool) {
      assert.equal(bool.valueOf(), true, "second admin missing");
      validators.removeAdmin(accounts[2]);
      return validators.isAdmin.call(accounts[2]);
    }).then(function(bool) {
      assert.equal(bool.valueOf(), false, "second admin is no longer admin");
    });
  });
});
