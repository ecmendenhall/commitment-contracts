const Commitment = artifacts.require('Commitment');

contract('Commitment', (accounts) => {

  describe('roles', () => {
    it('has an owner', () => {
      return Commitment.new(accounts[1], 1).then((instance) => {
        return instance.owner.call();
      }).then((owner) => {
        assert.equal(owner, accounts[0]);
      });
    });

    it('has a referee', () => {
      return Commitment.new(accounts[1], 1).then((instance) => {
        return instance.referee.call();
      }).then((referee) => {
        assert.equal(referee, accounts[1]);
      });
    });
  });

  describe('goals', () => {
    it('the goal is incomplete at contract creation time', () => {
      return Commitment.new(accounts[1], 1).then((instance) => {
        return instance.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
      });
    });

    it('the referee can set the goal completed', () => {
      let commitment;
      return Commitment.new(accounts[1], 1).then((instance) => {
        commitment = instance;
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
        return commitment.setGoalCompleted({from: accounts[1]});
      }).then((tx) => {
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, true);
      });
    });

    it('the owner cannot set the goal completed', () => {
      let commitment;
      return Commitment.new(accounts[1], 1).then((instance) => {
        commitment = instance;
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
        return commitment.setGoalCompleted({from: accounts[0]});
      }).then(
        (tx) => {
          assert(false, 'owner should not be authorized to set goal completed');
        },
        (error) => {
          assert.match(error, /VM Exception while processing transaction: revert/);
        }
      ).then(() => {
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
      });
    });

    it('third parties cannot set the goal completed', () => {
      let commitment;
      return Commitment.new(accounts[1], 1).then((instance) => {
        commitment = instance;
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
        return commitment.setGoalCompleted({from: accounts[2]});
      }).then(
        (tx) => {
          assert(false, 'owner should not be authorized to set goal completed');
        },
        (error) => {
          assert.match(error, /VM Exception while processing transaction: revert/);
        }
      ).then(() => {
        return commitment.goalCompleted.call();
      }).then((goalCompleted) => {
        assert.equal(goalCompleted, false);
      });
    });

    it('sends contract balance back to owner if term is not expired', () => {
      let commitment;
      let startingBalance;
      return Commitment.new(accounts[1], 1).then((instance) => {
        commitment = instance;
        return web3.eth.getBalance(accounts[0]);
      }).then((ownerBalance) => {
        startingBalance = ownerBalance;
        return commitment.send(web3.toWei(1, 'ether'));
      }).then((tx) => {
        return web3.eth.getBalance(commitment.address);
      }).then((contractBalance) => {
        assert.equal(contractBalance, web3.toWei(1, 'ether'));
        return commitment.setGoalCompleted({from: accounts[1]});
      }).then((tx) => {
        return web3.eth.getBalance(commitment.address);
      }).then((contractBalance) => {
        assert.equal(contractBalance.valueOf(), 0);
        return web3.eth.getBalance(accounts[0]);
      }).then((ownerBalance) => {
        let balanceChange = startingBalance.minus(ownerBalance);
        let balanceChangeInEth = web3.fromWei(balanceChange, 'ether').toNumber();
        assert.isAbove(balanceChangeInEth, 0);
        assert.isBelow(balanceChangeInEth, 0.0025);
      });
    });

    it('does not send contract balance back to owner if term is expired', () => {
      let commitment;
      let startingBalance;
      return Commitment.new(accounts[1], 0).then((instance) => {
        commitment = instance;
        return web3.eth.getBalance(accounts[0]);
      }).then((ownerBalance) => {
        startingBalance = ownerBalance;
        return commitment.send(web3.toWei(1, 'ether'));
      }).then((tx) => {
        return web3.eth.getBalance(commitment.address);
      }).then((contractBalance) => {
        assert.equal(contractBalance, web3.toWei(1, 'ether'));
        return commitment.setGoalCompleted({from: accounts[1]});
      }).then((tx) => {
        return web3.eth.getBalance(commitment.address);
      }).then((contractBalance) => {
        assert.equal(contractBalance, web3.toWei(1, 'ether'));
        return web3.eth.getBalance(accounts[0]);
      }).then((ownerBalance) => {
        let balanceChange = startingBalance.minus(ownerBalance);
        let balanceChangeInEth = web3.fromWei(balanceChange, 'ether').toNumber();
        assert.isAbove(balanceChangeInEth, 1.0);
        assert.isBelow(balanceChangeInEth, 1.0025);
      });
    });
  });

  describe('term', () => {

    it('stores its creation time', () => {
      return Commitment.new(accounts[1], 1).then((instance) => {
        return instance.createdAt.call();
      }).then((createdAt) => {
        assert.match(createdAt.valueOf(), /1514\d{6}/);
      });
    });

    it('stores its term in days', () => {
      return Commitment.new(accounts[1], 14).then((instance) => {
        return instance.term.call();
      }).then((term) => {
        assert.equal(term.valueOf(), '1209600');
      });
    });

    describe('termExpired', () => {
      it('is true when the term has expired', () => {
        return Commitment.new(accounts[1], 0).then((instance) => {
          return instance.termExpired.call();
        }).then((expired) => {
          assert.equal(expired, true);
        });
      });

      it('is false when the term has not expired', () => {
        return Commitment.new(accounts[1], 1).then((instance) => {
          return instance.termExpired.call();
        }).then((expired) => {
          assert.equal(expired, false);
        });
      });
    });
  });

  describe('payment', () => {
    it('is payable', () => {
      let commitment;
      return Commitment.new(accounts[1], 1).then((instance) => {
        commitment = instance;
        return commitment.send(web3.toWei(1, 'ether'));
      }).then((tx) => {
        return web3.eth.getBalance(commitment.address);
      }).then((balance) => {
        assert.equal(web3.fromWei(balance, 'ether').valueOf(), '1');
      });
    });
  });

});
