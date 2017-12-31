const Commitment = artifacts.require('Commitment');

contract('Commitment', (accounts) => {

  it('has an owner', () => {
    return Commitment.new().then((instance) => {
      return instance.owner.call();
    }).then((value) => {
      assert.equal(value, accounts[0]);
    });
  });

});
