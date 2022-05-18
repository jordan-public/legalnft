// SPDX-License-Identifier: Apache-2.0 and MIT
pragma solidity 0.6.12;

import "./Interfaces.sol";
import "./IERC721.sol";

contract Pawn {
    ILendingPool constant lendingPool = ILendingPool(address(0x9E5C7835E4b13368fd628196C4f1c6cEc89673Fa)); // Ropsten

    // each loan
    struct Loan {
        IERC721 collateralKind;
        uint256 collateralTokenId;
        IERC20 currency;
        uint256 borrowAmount;
        uint256 repayAmount;
        uint256 deadline;
        bool locked;
        bool liquidated;
        address borrower;
        address lender;
    }

    Loan[] public loans;
    //mapping (uint256 => Loan) public loans;

    // collateralize
    function collateralize(IERC721 collateralKind, uint256 collateralTokenId, IERC20 currency, uint256 borrowAmount, uint256 repayAmount, uint256 deadline) public returns (uint256 loanId) {
        collateralKind.transferFrom(msg.sender, address(this), collateralTokenId);
        loanId = loans.length;
        loans.push(Loan(collateralKind, collateralTokenId, currency, borrowAmount, repayAmount, deadline, false, false, msg.sender, address(0)));
    }

    // lend
    function lend(uint256 loanId) public {
        require(loans[loanId].locked == false);
        require(loans[loanId].liquidated == false);
        require(loans[loanId].deadline > block.timestamp);
        loans[loanId].lender = msg.sender;
        loans[loanId].locked = true;
        loans[loanId].currency.transferFrom(msg.sender, loans[loanId].borrower, loans[loanId].borrowAmount);
    }

    // repay
    function repay(uint256 loanId) public {
        require(loans[loanId].locked == true);
        require(loans[loanId].liquidated == false);
        loans[loanId].currency.transferFrom(msg.sender, loans[loanId].lender, loans[loanId].repayAmount);
        loans[loanId].collateralKind.transferFrom(address(this), loans[loanId].borrower, loans[loanId].collateralTokenId);
        loans[loanId].liquidated = true; // Closed is same as liquidated - it no longer exists
        lendingPool.repay(address(loans[loanId].currency), loans[loanId].repayAmount, 1, loans[loanId].lender); // Repay AAVE pool
    }

    // liquidate
    function liquidate(uint256 loanId) public {
        require(loans[loanId].lender == msg.sender);
        require(loans[loanId].locked == true);
        require(loans[loanId].liquidated == false);
        require(block.timestamp > loans[loanId].deadline);
        loans[loanId].collateralKind.transferFrom(address(this), msg.sender, loans[loanId].collateralTokenId);
        loans[loanId].liquidated = true;
    }
}