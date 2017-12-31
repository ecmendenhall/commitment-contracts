pragma solidity ^0.4.17;

contract Commitment {
  address public owner;
  address public referee;

  function Commitment(address _referee) public {
    owner = msg.sender;
    referee = _referee;
  }

}
