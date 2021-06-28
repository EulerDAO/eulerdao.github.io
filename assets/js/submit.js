class Submit {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('title').innerText = `Submit Solution for Problem ${this.args.get('id')}`;
        // fetch(`/problems/data/${this.args.get('id')}/solution.txt`).then(v => v.text()).then(content => {
        //     document.getElementById('code').value = content;
        // })
    }
    submit() {
        alert('submit')
    }
}


window.addEventListener('load', () => {
    window.submit = new Submit();
})
