class Problem {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        const target = this.args.get('id');
        document.getElementById('content').src = `/problems/${target}`;
        const cachedCode = window.localStorage.getItem(target);
        document.getElementById('code').value = cachedCode;
        document.getElementById('code').placeholder = 'Input your solidity bytecode here.\nIt looks like 0x1234567890abcdef and must start with "0x".\nYou can compile your solidity in remix or local machine.';
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
        const target = this.args.get('id');
        if (target === undefined || target === null || target === '') {
            alert("Choose a problem first");
            return;
        }

        let bytecode = document.getElementById('code').value;
        try {
            bytecode = JSON.parse(bytecode).object;
        } catch {}
        if ((/^[0-9A-Fa-f]+$/g).test(bytecode)) {
            bytecode = '0x' + bytecode;
        }

        const ed = '0xC3a65484e3D59689B318fB23c210a079873CFfbB'; // TODO
        var digest;
        try {
            digest = window.ethers.utils.keccak256(bytecode);
        } catch {
            alert('invald bytecode')
            return;
        }
        const abi = [
            'function lock_challenge(uint256 id) external payable',
            'function ownerOf(uint256 id) external view returns (address)',
        ]
        const contract = new window.ethers.Contract(ed, abi, signer);
        try {
            await contract.ownerOf(digest);
            window.open(`/solution?id=${digest}`, '_blank');
            return;
        } catch {
        }

        contract.lock_challenge(digest).then(async (r) => {
            window.localStorage.setItem(target, bytecode);
            await r.wait();
            window.open(`/solution?id=${digest}`, '_blank');
        }).catch(
            (e) => {
                switch (e.code) {
                    case 4001:
                        // user cancel
                        break;
                    default:
                }
            });
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})