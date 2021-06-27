class Wallet {
    constructor() {
        this.web3Modal = new window.Web3Modal.default({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: window.WalletConnectProvider.default,
                    options: {
                        // TODO
                        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
                    }
                },
            },
        });
        this.signer = null;
    }

    async click(obj) {
        if (this.signer !== null) {
            return
        }
        const web3provider = await this.web3Modal.connect();
        web3provider.on("accountsChanged", async (accounts) => {
            if (accounts.length === 0) {
                await this.web3Modal.clearCachedProvider();
                this.signer = null;
                await this.render(obj);
                return
            }
            const provider = new window.ethers.providers.Web3Provider(web3provider);
            this.signer = await provider.getSigner();
            await this.render(obj);
        });
        web3provider.on("chainChanged", async (chainId) => {
            const provider = new window.ethers.providers.Web3Provider(web3provider);
            this.signer = await provider.getSigner();
            await this.render(obj);
        });
        web3provider.on("disconnect", async (error) => {
            await this.web3Modal.clearCachedProvider();
            this.signer = null;
            await this.render(obj);
        });
        const provider = new window.ethers.providers.Web3Provider(web3provider);
        this.signer = await provider.getSigner();
        await this.render(obj);
    }

    async render(obj) {
        if (this.signer === null) {
            obj.innerText = 'Connect Wallet';
            obj.href = `javascript:void(0);`
            obj.target = '_self';
            return;
        }
        const address = await this.signer.getAddress();
        const chainid = await this.signer.getChainId();
        const network = window.ethers.providers.getNetwork(chainid);
        obj.innerText = `${network.name === 'homestead' ? '' : network.name + ' - '}${address}`;
        obj.href = `https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${address}`
        obj.target = '_blank';
    }
}

window.wallet = new Wallet();