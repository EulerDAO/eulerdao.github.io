class Problem {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('content').src = `/problems/${this.args.get('id')}`
    }
    resize() {
        const obj = document.getElementById('content');
        obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }
    async submit() {
        const signer = window.wallet.signer;
        if (signer === null) {
            alert("Connect wallect first!");
            return;
        }

        let bytecode = document.getElementById('code').value;
        try {
            bytecode = JSON.parse(bytecode).object;
        } catch {
        }
        if ((/^[0-9A-Fa-f]+$/g).test(bytecode)) {
            bytecode = '0x' + bytecode;
        }

        const ed = '0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'; // TODO
        var digest;
        try {
            digest = window.ethers.utils.keccak256(bytecode);
        } catch {
            alert('invald bytecode')
            return;
        }
        const abi = [
            'function lock_challenge(uint256 id) public payable',
        ]
        const contract = new window.ethers.Contract(ed, abi, signer);
        await contract.lock_challenge(digest);
        window.open(`/solution?id=${digest}`, '_blank');
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})