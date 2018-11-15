pragma solidity ^0.4.17;

contract Inbox {
    string public message;

    constructor(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function random() private view returns (uint) {
        return uint(sha3(block.difficulty, now, players));
    }

    function pickWinner() public {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
    }
}
