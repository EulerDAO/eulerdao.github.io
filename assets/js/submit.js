class Submit {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        const resp = fetch(`/problems/data/${this.args.get('id')}/solution.txt`).then(v => v.text()).then(content => {
            document.getElementById('submit-title').innerText = `Problem ${this.args.get('id')}`;
            document.getElementById('code').value = content;
        })
    }
    submit() {
        alert('submit')
    }
}


window.addEventListener('load', () => {
    window.submit = new Submit();
})
