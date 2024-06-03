// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TicketingSystem is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = initialSupply * 10**uint256(decimals);
        // The contract itself should start with the supply of tickets, acting like a vendor, instead of the account that deployed the contract
        _balances[address(this)] = _totalSupply;
        emit Transfer(address(0), address(this), _totalSupply);
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    // Can be used to transfer a ticket from person to person
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    // person who sends this approve function (the ticket buyer) will given permission to the spender to transfer the specified amount of their tickets on the owners behalf
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    // Use to transfer ticket from any wallet to any wallet. The sender of the transaction does not need to be the owner of the ticket
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

            // Check if there's an existing allowance, and increment it by the amount if so
        if (_allowances[owner][spender] > 0) {
            _allowances[owner][spender] += amount;
        } else {
            // If no existing allowance, assign the amount
            _allowances[owner][spender] = amount;
        }
        emit Approval(owner, spender, amount);
    }

    // buyToken is payable, 
    function buyToken() external payable {
        require(msg.value >= 0.0001 ether, "Not enough ETH sent; check price!");
        require(msg.value < 0.01 ether, "Too much ETH sent; Can only buy 99 tickets per transaction");

        // Calculate the token amount. Here we're assuming 1 token for 0.00001 ETH.
        // Adjust this if you want a different ratio.
        uint256 tokenAmount = msg.value / 0.0001 ether;
        // convert tokenAmount to wei
        tokenAmount = tokenAmount * 10**uint256(decimals);
        // Transfer the tokens to the sender
        _transfer(address(this), msg.sender, tokenAmount);
    }
}
