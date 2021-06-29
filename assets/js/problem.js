class Problem {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('content').src = `/problems/${this.args.get('id')}`;
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
        const contract = new window.ethers.Contract('0xC3a65484e3D59689B318fB23c210a079873CFfbB', ['function lock_challenge(uint256 id) external payable', 'function ownerOf(uint256 id) external view returns (address)', 'function problems(uint256) returns (address)'], signer);
        const target = this.args.get('id');
        try {
            await contract.problems(target);
        } catch {
            alert('problem not exist');
            return;
        }
        const bytecode = document.getElementById('code').value;
        let digest;
        try {
            digest = window.ethers.utils.keccak256(bytecode);
        } catch {
            alert('invald bytecode')
            return;
        }
        try {
            await contract.ownerOf(digest);
            window.open(`/solution?id=${digest}`, '_blank');
            return;
        } catch {
        }
        const tx = await contract.lock_solution(target, digest);
        window.localStorage.setItem(digest, bytecode);
        await tx.wait()
        window.open(`/solution?id=${digest}`, '_blank');
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})