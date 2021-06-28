class Submit {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
        document.getElementById('submit-title').innerText = `Problem ${this.args.get('id')}`;
    }

    async render() {
        const x = await fetch(`/problems/data/${this.args.get('id')}/solution.txt`);
        const content = await x.text();
        document.getElementById('submit-code').value = content;
    }

    submit() {
        alert('submit')
    }
}


window.addEventListener('load', () => {
    window.submit = new Submit();
    window.submit.render();
    document.getElementById('submit-button').addEventListener('click', ()=>{
        window.submit.submit();
    })
})
