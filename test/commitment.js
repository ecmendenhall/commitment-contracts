const Commitment = artifacts.require('Commitment');

contract('Commitment', (accounts) => {

  it('exists', () => {
    return Commitment.new().then((instance) => {
      assert.isNotNull(instance);
    });
  });

});
