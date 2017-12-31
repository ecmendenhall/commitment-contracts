const Commitment = artifacts.require('Commitment');

contract('Commitment', (accounts) => {

  it('has an owner', () => {
    return Commitment.new().then((instance) => {
      return instance.owner.call();
    }).then((value) => {
      assert.equal(value, accounts[0]);
    });
  });

  it('has a referee', () => {
    return Commitment.new(accounts[1]).then((instance) => {
      return instance.referee.call();
    }).then((value) => {
      assert.equal(value, accounts[1]);
    });
  });

});
