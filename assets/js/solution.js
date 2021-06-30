class Solution {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
    }
    async render() {
        const digest = this.args.get('id');
        const payload = `0xff${'C3a65484e3D59689B318fB23c210a079873CFfbB'}0000000000000000000000000000000000000000000000000000000000000000${digest.substring(2)}`;
        const address = `0x${window.ethers.utils.keccak256(payload).substring(26)}`;
        if (window.wallet.signer === null) {
            return;
        }
        const ctx = {};
        const contract = new window.ethers.Contract('0xC3a65484e3D59689B318fB23c210a079873CFfbB', ['function targets(uint256) external view returns(uint256)', 'function scores(uint256) external view returns(uint256)', 'function timestamps(uint256) external view returns(uint256)', 'function challengers(uint256) external view returns(address)', 'function ownerOf(uint256) external view returns (address)'], window.wallet.signer);
        try {
            ctx.target = await contract.targets(digest);
        } catch { }
        try {
            ctx.score = await contract.scores(digest);
        } catch { }
        try {
            ctx.timestamp = await contract.timestamps(digest);
        } catch { }
        try {
            ctx.challenger = await contract.challengers(digest);
        } catch { }
        try {
            ctx.owner = await contract.ownerOf(digest);
        } catch { }
        try {
            ctx.code = await contract.provider.getCode(address);
        } catch { }

        switch (code) {
            case '0x':
                document.getElementById('code').innerHTML = '';
                const textarea = document.createElement('textarea');
                textarea.value = window.localStorage.getItem(digest);
                textarea.style.width = '100%';
                textarea.style.height = '25vh';
                textarea.style.placeholder = 'input the compiled bytecode (createcode) starts with 0x';
                document.getElementById('code').appendChild(textarea);
                const button = document.createElement('button');
                button.innerText = 'deploy solution';
                button.style.width = '100%';
                button.onclick = () => { alert(1) };
                document.getElementById('code').appendChild(button);
                break;
            default:
                document.getElementById('code').innerHTML = '';
                const chainid = await window.wallet.signer.getChainId();
                const network = window.ethers.providers.getNetwork(chainid);
                const a = document.createElement('a');
                a.innerText = `Solution is deployed at ${address}`;
                a.href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${address}`
                document.getElementById('code').appendChild(a);
                break;
        }

        return;

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
        if (this.score == 0) {
            document.getElementById('noenter').style.visibility = 'visible';
            return;
        }
        document.getElementById('entered').style.visibility = 'visible';
        document.getElementById('showscore').innerText = `Score: ${this.score}`

        // has challenger or not
        const thisAddr = await window.wallet.signer.getAddress();
        if (!this.challenger.eq(window.ethers.BigNumber.from(thisAddr))) {
            document.getElementById('lock').style.visibility = 'visible';
            if (thisAddr === this.owner) {
                document.getElementById('lock').innerText = 'prepare to revoke'
            } else {
                document.getElementById('lock').innerText = 'to be the challenger'
            }
        } else {
            if (thisAddr == this.owner) {
                document.getElementById('revoke').style.visibility = 'visible';
            } else {
                document.getElementById('challenge').style.visibility = 'visible';
            }
        }
    }
    async compete() {
        const abi = [
            'function compete(uint256 id, uint256 score) external payable',
        ]
        const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
        const score = document.getElementById('score').value;
        console.log('owner', this.owner);
        await contract.compete(this.digest, score, { value: '2000000000000000000' });
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
        await contract.lock_challenge(this.digest);
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
    window.solution.render();
});
window.addEventListener('connect', () => {
    window.solution.render();
})