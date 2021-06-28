class Submit {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        const resp = await fetch(`/problems/data/${this.args.get('id')}/solution.txt`);
        const content = await resp.text();
        document.getElementById('submit-title').innerText = `Problem ${this.args.get('id')}`;
        document.getElementById('code').value = content;
    }
    submit() {
        alert('submit')
    }
}


window.addEventListener('load', () => {
    window.submit = new Submit();
})
