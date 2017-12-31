pragma solidity ^0.4.17;

contract Commitment {
  address public owner;
  address public referee;
  bool public goalCompleted;
  uint public createdAt;
  uint public term;

  function Commitment(address _referee, uint _term) public {
    owner = msg.sender;
    referee = _referee;
    goalCompleted = false;
    createdAt = now;
    term = _term * 1 days;
  }

  modifier onlyBy(address _role) {
    require(msg.sender == _role);
    _;
  }

  function setGoalCompleted() public onlyBy(referee) {
    goalCompleted = true;
  }

  function termExpired() public view returns (bool) {
    return now >= (createdAt + term);
  }

}
