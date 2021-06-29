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
        this.address = window.ethers.utils.keccak256('0xff'+this.ed.substring(2)+'0000000000000000000000000000000000000000000000000000000000000000'+this.digest.substring(2));
        console.log('code digest', window.ethers.utils.keccak256(cachedCode));
        console.log(this.address);
        console.log('dest: 0xd9e54a4Cc4f7Ec4c8d325d2EFf53d6aA287EC00D');
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
        console.log(this.address, await contract.provider.getCode(this.address));
        if (await contract.provider.getCode(this.address) !== '0x') {
            this.deployed = true;
        }

        if (this.owner !== undefined) {
            document.getElementById('problem').href = `/problems/${this.target}`;
            document.getElementById('problem').style.visibility = 'visible';
        }

        // etherscan view or submit code
        if (!this.deployed) {
            document.getElementById('submitcode').style.visibility = 'visible';
            return;
        }

        const chainid = await window.wallet.signer.getChainId();
        const network = window.ethers.providers.getNetwork(chainid);
        document.getElementById('etherscan').href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.address}`
        document.getElementById('etherscan').style.visibility = 'visible';

        // entered or not not entered
        if (this.score === 0) {
            document.getElementById('noenter').style.visibility = 'visible';
            return;
        }
        document.getElementById('entered').style.visibility = 'visible';
        document.getElementById('showscore').innerText = `Score: ${this.score}`

        // has challenger or not
        if (this.challenger !== window.signer.address) {
            document.getElementById('lock').style.visibility = 'visible';
            if (this.challenger === this.owner) {
                document.getElementById('lock').innerText = 'prepare to revoke'
            } else {
                document.getElementById('lock').innerText = 'to be the challenger'
            }
        } else {
            if (this.challenger === this.owner) {
                document.getElementById('challenge').style.visibility = 'visible';
            } else {
                document.getElementById('revoke').style.visibility = 'visible';
            }
        }
    }
    async compete() {
        const abi = [
            'function compete(uint256 id, uint256 score) external payable',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        const score = document.getElementById('score').value;
        await contract.compete(this.digest, score);
    }
    async submit_code() {
        const abi = [
            'function submit_code(bytes memory code) external',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        const bytecode = document.getElementById('bytecode').value;
        //TODO verify hash is digest
        await contract.submit_code(bytecode);
    }
    async lock() {
        const abi = [
            'function lock_challenge(uint256 id) public payable',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        await contract.lock_challenge(this.digest, {value: '2000000000000000000'});
    }
    async challenge() {
        const abi = [
            'function challenge(uint256 id, bytes calldata i) external payable',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        await contract.challenge(this.digest, '0x11');
    }
    async revoke() {
        const abi = [
            'function revoke(uint256 id) external payable ',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        await contract.revoke(this.digest);
    }
}

window.addEventListener('load', () => {
    window.solution = new Solution();
});
window.addEventListener('connect', () => {
    window.solution.render();
})