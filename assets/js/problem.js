class Problem {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('content').src = `/problems/${this.args.get('id')}`
    }
    resize() {
        const obj = document.getElementById('content');
        obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }
    refine(event) {
        var bytecode = event.target.value;
        try {
            console.log(bytecode)
            bytecode = JSON.parse(bytecode).object;
            console.log(bytecode)
        } catch {
        }
        console.log(bytecode)
        if ((/^[0-9A-Fa-f]+$/g).test(bytecode)) {
            bytecode = '0x' + bytecode;
        }
        console.log(bytecode)
        document.getElementById('code').value = bytecode;
        event.preventDefault();
    }
    async submit() {
        const pool = '0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'; // TODO
        const signer = window.wallet.signer;
        if (signer === null) {
            alert("Connect wallect first!");
            return;
        }

        var bytecode = document.getElementById('code').value;
        var digest;
        try {
            digest = window.ethers.utils.keccak256(bytecode);
        } catch {
            alert('invald bytecode')
        }
        const abi = [
            'function lock_challenge(uint256 id) public payable',
        ]
        const contract = new window.ethers.Contract(pool, abi, signer);
        await contract.lock_challenge(digest);
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})