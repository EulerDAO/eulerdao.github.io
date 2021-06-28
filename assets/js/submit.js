class Submit {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        fetch(`/problems/data/${this.args.get('id')}/solution.txt`).then(v => v.text()).then(content => {
            document.getElementById('title').innerText = `Problem ${this.args.get('id')}`;
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
