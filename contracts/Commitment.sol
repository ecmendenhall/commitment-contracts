pragma solidity ^0.4.17;

contract Commitment {
  address public owner;
  address public referee;
  bool public goalCompleted;

  function Commitment(address _referee) public {
    owner = msg.sender;
    referee = _referee;
    goalCompleted = false;
  }

  function setGoalCompleted() public {
    require(msg.sender == referee);
    goalCompleted = true;
  }

}
