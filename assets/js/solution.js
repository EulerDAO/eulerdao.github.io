class Solution {
    constructor() {
        this.ed = '0xC3a65484e3D59689B318fB23c210a079873CFfbB'; // TODO
        this.args = new URLSearchParams(window.location.search);
        this.digest = this.args.get('id');
        if (this.digest === '' && this.args.get('decimal') !== '') {
            this.digest = decToHex(this.args.get('decimal'));
        }

        const cachedCode = window.localStorage.getItem(this.digest);
        document.getElementById('bytecode').value = cachedCode;
        document.getElementById('bytecode').placeholder = 'Input your solidity bytecode here.\nIt looks like 0x1234567890abcdef and must start with "0x".\nThis must be as same as the one you submited on problem page.';
        this.address = window.ethers.utils.keccak256(
            window.ethers.utils.defaultAbiCoder.encode(
                ["bytes1", "address", "bytes32", "bytes32"],
                ["0xff", this.ed, "0x0000000000000000000000000000000000000000000000000000000000000000", this.digest])
        );
        this.address = "0x" + this.address.substr(26);
    }
    async render() {
        const abi = [
            'function targets(uint256) external view returns(uint256)',
            'function scores(uint256) external view returns(uint256)',
            'function timestamps(uint256) external view returns(uint256)',
            'function challengers(uint256) external view returns(uint256)',
            'function ownerOf(uint256 id) external view returns (address)',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        try {
            this.target = await contract.targets(this.digest);
            this.score = await contract.targets(this.digest);
            this.timestamp = await contract.targets(this.digest);
            this.challenger = await contract.targets(this.digest);
            this.owner = await contract.ownerOf(this.digest); // undefined if nft is not issued
        } catch {}
        if (await contract.provider.getCode(this.address) !== '0x') {
            this.deployed = true;
        }

        // etherscan view or submit code
        if (this.deployed) {
            const chainid = await window.wallet.signer.getChainId();
            const network = window.ethers.providers.getNetwork(chainid);
            document.getElementById('etherscan').href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.address}`
            document.getElementById('etherscan').style.visibility = 'visible';
        } else {
            document.getElementById('submitcode').style.visibility = 'visible';
        }

        if (this.owner !== undefined) {
            document.getElementById('problem').href = `/problems/${this.target}`;
            document.getElementById('problem').style.visibility = 'visible';
        }

        // entered or not not entered
        if (this.score > 0) {
            document.getElementById('entered').style.visibility = 'visible';
        } else {
            document.getElementById('noenter').style.visibility = 'visible';
        }
    }
    async compete() {
        const abi = [
            'function compete(uint256 id, uint256 score) external payable',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        const score =  document.getElementById('score').value;
        await contract.compete(this.digest, score);
    }
    async submit_code() {
        const abi = [
            'function submit_code(bytes memory code) external',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        const bytecode =  document.getElementById('bytecode').value;
        //TODO verify hash is digest
        await contract.submit_code(bytecode);
    }
}

window.addEventListener('load', () => {
    window.solution = new Solution();
});
window.addEventListener('connect', () => {
    window.solution.render();
})