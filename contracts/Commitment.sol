pragma solidity ^0.4.17;

contract Commitment {
  address public owner;

  function Commitment() public {
    owner = msg.sender;
  }

}
