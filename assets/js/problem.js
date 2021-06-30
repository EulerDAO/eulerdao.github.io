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
        if (!window.wallet.signer) {
            alert("Connect wallect first!");
            return;
        }
        const contract = new window.ethers.Contract('0xC3a65484e3D59689B318fB23c210a079873CFfbB', ['function lock_solution(uint256, uint256) external', 'function ownerOf(uint256) external view returns (address)', 'function problems(uint256) external view returns (address)'], window.wallet.signer);
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
        const tx = await contract.lock_solution(digest, target);
        window.localStorage.setItem(digest, bytecode);
        await tx.wait()
        window.open(`/solution?id=${digest}`, '_blank');
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})