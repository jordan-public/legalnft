# Legal NFT

LegalNFT encapsulates legal agreements into NFTs. Such NFTs represents actual assets and/or liabilities, and they can in turn be transferred, traded, used as collateral in DeFi, etc.
## Desctiption

The user can simply create a LegalNFT Agreement, drop documents into it as well as write simple fields (which are saved as small text files).

As files are dropped and/or removed, the Agreeement ID (CID) is changed. The user can copy the
current CID and communicate it to another user via any medium, such as email or text message. The recipient can open the same agreement. It is next to impossible to create a different set of documents that would correspond to the same CID. The recipient can also modify the agreement and send back the new CID of the modified agreement. 

Once both (or all) parties are satisfied with the content, they can sign using their Ethereum private key using MetaMask (or in combination with a hardware wallet like Trezor). The signed agreement CIDs can also be circulated.

Once all involved parties have signed, the agreement can be "notarized" using MetaMask again. This mints an NFT, which represents the signed and recorded (notarized) agreement.

This NFT describes an actual agreement which is immutably referenced in it. Depending on the content, the agreement can represent an asset or liability, which can be transferred to another party. The transfer can represent a sale or lending or collateralization, which can be further engaged in various Decentralized Finance (DeFi) protocols.
## Implementation

The front end is implemented in React/JavaScript. It uses web3.js, MetaMask and IPFS APIs. There is no centralized back end. The front end communicated to an Ethereum EVM compatible blockchain to call the NFT smart contract which is written in Solidity.

All documents are stored in IPFS. A tree structure holds a folder of documents and a folder of signatures, the CID of the root represents an immutable unique representation of the tree. In addition, the as the calculation of the CID is a one-way function, matching of the CID is practically a guarantee that no document or signature has been tampered with.

The agreement is signed by simply signing the root CID, instead of some standardized hash of the documents. MetaMask is used for signing, but for the signature verification it's not needed - the web3 API can check the signature and reveal and mathch the public key (and Ethereum address) of the signer.

As the notarization NFT is minted, the CID of its root is pinned in IPFS. The local IPFS node is configired to use Pinata for the pinning, but this eventually shall be pinned using FileCoin storage, to assure that the content referenced by the NFT never disappears.

## Demo - Car Leasing and lease transfer

In the demo, a Car Lease Agreement is signed and notarized by the Lessor and the Lessee. The Lessee decides top stop paying for the car and transfer the lease to a third party by simply transferring the corresponding NFT.
## Further use - Morgage Lending Example

Finally a motrgage proof of concept protocol is developed. For example, the Borrower owns a house, for which he signs an agreement to tie its ownership to a LegalNFT. This NFT is then transferred to a "Pawn" contract as collateral.

The Lender deposits ETH into AAVE as collateral to borrow USDC against it and pay lend it to the Borrower, via the Pawn contract.

Once the Borrower repays the loan to the Pawn contract, his collateral is released, and atomically part of the re-payment is used to repay the Lender's AAVE loan and release his ETH collateral, while another part is paid directly to the Lender as profit. 