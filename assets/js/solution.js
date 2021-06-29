class Solution {
    constructor() {
        this.ed = '0xC3a65484e3D59689B318fB23c210a079873CFfbB'; // TODO
        this.args = new URLSearchParams(window.location.search);
        this.digest = this.args.get('id');
        const cachedCode = window.localStorage.getItem(this.digest);
        document.getElementById('bytecode').value = cachedCode;
        document.getElementById('bytecode').placeholder = 'Input your solidity bytecode here.\nIt looks like 0x1234567890abcdef and must start with "0x".\nThis must be as same as the one you submited on problem page.';
        this.address = window.ethers.utils.keccak256(
            window.ethers.utils.defaultAbiCoder.encode(
                ["bytes1", "address", "bytes32", "bytes32"],
                ["0xff", this.ed, "0x0000000000000000000000000000000000000000000000000000000000000000", this.digest])
        );
    }
    async render() {
        try{
            const abi = [
                'function targets(uint256) external view returns(uint256)',
                'function ownerOf(uint256 id) external view returns (address)',
            ]
            const contract = new window.ethers.Contract(this.ed, abi, window.wallet.signer);
            this.id = await contract.targets(this.digest);
            this.owner = await contract.ownerOf(this.digest);
        } catch{}
        // etherscan href
        if (window.wallet.signer !== null) {
            console.log(window.wallet);
            console.log(window.solution);
            const chainid = await window.wallet.signer.getChainId();
            const network = window.ethers.providers.getNetwork(chainid);
            document.getElementById('etherscan').href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.address}`
            document.getElementById('etherscan').style.visibility = 'visible';
        }
        if (this.owner !== undefined) {
            document.getElementById('problem').href = `/problems/${this.id}`;
            document.getElementById('problem').style.visibility = 'visible';
        }
    }
}

window.addEventListener('load', () => {
    window.solution = new Solution();
});
window.addEventListener('connect', () => {
    window.solution.render();
})