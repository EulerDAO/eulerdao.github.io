class Solution {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
    }
    async render() {
        const digest = this.args.get('id');
        const payload = `0xff${'C3a65484e3D59689B318fB23c210a079873CFfbB'}0000000000000000000000000000000000000000000000000000000000000000${digest.substring(2)}`;
        const address = `0x${window.ethers.utils.keccak256(payload).substring(26)}`;
        if (!window.wallet.signer) {
            return;
        }
        const chainid = await window.wallet.signer.getChainId();
        const network = window.ethers.providers.getNetwork(chainid);
        const ctx = {};
        const contract = new window.ethers.Contract('0xC3a65484e3D59689B318fB23c210a079873CFfbB', ['function revoke(uint256 id) external payable', 'function challenge(uint256 id, bytes calldata i) external payable', 'function lock_challenge(uint256 id) public payable', 'function targets(uint256) external view returns(uint256)', 'function compete(uint256 id, uint256 score) external payable', 'function scores(uint256) external view returns(uint256)', 'function timestamps(uint256) external view returns(uint256)', 'function challengers(uint256) external view returns(address)', 'function ownerOf(uint256) external view returns (address)', 'function submit_code(bytes memory code) external'], window.wallet.signer);
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
        try {
            ctx.me = await window.wallet.signer.getAddress();
        } catch { }

        var timePassed = Math.max(0, Math.floor(Date.now() / 1000) - ctx.timestamp.toNumber() - 15);
        var fee = window.ethers.BigNumber.from('0xffffffffffffffffffffffffffffffff').div(window.ethers.constants.One.shl(Math.floor(timePassed / 8)));

        if (ctx.owner === undefined) {
            document.getElementById('code').innerText = 'Solution not Found';
            return;
        }

        document.getElementById('info').style.visibility = 'visible';

        {
            function showCD() {
                const fullCD = 1024;
                if (timePassed < fullCD) {
                    timePassed = Math.max(0, Math.floor(Date.now() / 1000) - ctx.timestamp.toNumber() - 15);
                    fee = window.ethers.BigNumber.from('0xffffffffffffffffffffffffffffffff').div(window.ethers.constants.One.shl(Math.floor(timePassed / 8)));
                    document.getElementById('td-timestamp').innerText = `Colling Down...[${fullCD - timePassed}]; You'll need to pay ${ethers.utils.formatEther(fee)} ether to skip CD`;
                    setTimeout(function () {
                        showCD();
                    }, 500);
                } else {
                    document.getElementById('td-timestamp').innerText = `Free`;
                }
            }
            showCD()
        }
        if (ctx.challenger !== ctx.me) {
            const a = document.createElement('a');
            a.href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${ctx.challenger}`;
            a.innerText = `${ctx.challenger}`;
            a.target = '_blank';
            const button = document.createElement('button');
            if (ctx.me == ctx.owner) {
                button.innerText = 'start revoke'
            } else {
                button.innerText = 'start challenge'
            }
            button.onclick = async () => {
                try {
                    const resp = await contract.lock_challenge(this.args.get('id'), { value: fee });
                    await resp.wait();
                    window.location.reload();
                } catch (e) {
                    console.log(e);
                    if (e.toString().indexOf('insufficient funds') >= 0) {
                        alert('insufficient funds');
                    }
                }
            };
            document.getElementById('td-challenger').innerHTML = '';
            document.getElementById('td-challenger').appendChild(a);
            document.getElementById('td-challenger').appendChild(button);
        } else {
            const button = document.createElement('button');
            let input;
            if (ctx.me == ctx.owner) {
                button.innerText = 'revoke';
                button.onclick = async () => {
                    const resp = await contract.revoke(this.args.get('id'));
                    await resp.wait();
                    window.location.reload();
                };
            } else {
                input = document.createElement('input');
                input.placeholder = 'abi encoded input';
                button.innerText = 'challenge';
                button.onclick = async () => {
                    const resp = await contract.challenge(this.args.get('id'), input.value);
                    await resp.wait();
                    window.location.reload();
                };

            }
            document.getElementById('td-challenger').innerHTML = '';
            if (input) {
                document.getElementById('td-challenger').appendChild(input);
            }
            document.getElementById('td-challenger').appendChild(button);

        }
        {
            const a = document.createElement('a');
            a.href = `/problem?id=${ctx.target}`;
            a.innerText = `Problem ${ctx.target}`;
            a.target = '_blank';
            document.getElementById('td-problem').innerHTML = '';
            document.getElementById('td-problem').appendChild(a);
        }
        {
            const a = document.createElement('a');
            a.href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${ctx.owner}`;
            a.innerText = `${ctx.owner}`;
            a.target = '_blank';
            document.getElementById('td-owner').innerHTML = '';
            document.getElementById('td-owner').appendChild(a);
        }
        if (ctx.score.eq(0)) {
            if (ctx.owner === ctx.me) {
                const input = document.createElement('input');
                const button = document.createElement('button');
                input.placeholder = 'input your score';
                button.innerText = 'Compete';
                button.onclick = async () => {
                    const score = input.value;
                    const val = window.ethers.BigNumber.from('100000000000').mul(window.ethers.BigNumber.from(input.value)).add(window.ethers.constants.WeiPerEther);
                    const resp = await contract.compete(this.args.get('id'), score, { value: val.toString() });
                    await resp.wait();
                    window.location.reload();
                };
                document.getElementById('td-score').innerHTML = ``;
                document.getElementById('td-score').appendChild(input);
                document.getElementById('td-score').appendChild(button);
            } else {
                document.getElementById('td-score').innerText = `❌[NO SCORE]`;
            }
        } else {
            document.getElementById('td-score').innerText = `✔️[${ctx.score}]`;
        }


        switch (ctx.code) {
            case '0x':
                document.getElementById('code').innerHTML = '';
                const textarea = document.createElement('textarea');
                textarea.value = window.localStorage.getItem(digest);
                textarea.style.width = '100%';
                textarea.style.height = '25vh';
                textarea.style.placeholder = 'input the compiled bytecode (createcode) starts with 0x';
                document.getElementById('code').appendChild(textarea);
                const button = document.createElement('button');
                button.innerText = 'Deploy Solution';
                button.style.width = '100%';
                button.onclick = async () => {
                    const bytecode = textarea.value;
                    try {
                        const hash = window.ethers.utils.keccak256(bytecode);
                        if (digest !== hash) {
                            alert('bytecode not match')
                            return;
                        }
                    } catch {
                        alert('invald bytecode')
                        return;
                    }
                    const resp = await contract.submit_code(bytecode);
                    await resp.wait();
                    window.location.reload();
                };
                document.getElementById('code').appendChild(button);
                break;
            default:
                document.getElementById('code').innerHTML = '';
                const h1 = document.createElement('h1');
                h1.style.textAlign = 'center';
                h1.style.color = 'green';
                h1.innerText = 'Solution Deployed';
                document.getElementById('code').appendChild(h1);
                const a = document.createElement('a');
                a.innerText = address
                a.style.textAlign = 'center';
                a.style.display = 'block';
                a.href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${address}#code`
                document.getElementById('code').appendChild(a);
                break;
        }
    }
}

window.addEventListener('load', () => {
    window.solution = new Solution();
    window.solution.render();
});
window.addEventListener('connect', () => {
    window.solution.render();
})