class Problem {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('content').src = `/problems/${this.args.get('id')}`
    }
}

window.addEventListener('load', () => {
    window.problem = new Problem();
})