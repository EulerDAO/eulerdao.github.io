class Solution {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        this.digest = this.args.get('id');
    }
    async render() {
        try{
            const ed = '0xC3a65484e3D59689B318fB23c210a079873CFfbB'; // TODO
            const abi = [
                'function targets(uint256) external view returns(uint256)',
            ]
            const contract = new window.ethers.Contract(ed, abi, window.wallet.signer);
            this.id = await contract.targets(this.digest);
        } catch{}
        // etherscan href
        if (window.wallet.signer !== null) {
            console.log(window.wallet);
            console.log(window.solution);
            const chainid = await window.wallet.signer.getChainId();
            const network = window.ethers.providers.getNetwork(chainid);
            document.getElementById('etherscan').href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.digest}`
            document.getElementById('etherscan').style.visibility = 'visible';
        }
        // 
        
        document.getElementById('problem').href = `/problems/${target}`;
        const cachedCode = window.localStorage.getItem(target);
        document.getElementById('bytecode').value = cachedCode;
        document.getElementById('bytecode').placeholder = 'Input your solidity bytecode here.\nIt looks like 0x1234567890abcdef and must start with "0x".\nThis must be as same as the one you submited on problem page.';
    }
}

window.addEventListener('load', () => {
    window.solution = new Solution();
    window.solution.render();
})