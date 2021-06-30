class List {
    constructor() {
        this.args = new URLSearchParams(window.location.search);
    }
    async render() {
        const obj = document.getElementById('content');
        switch (this.args.get('data')) {
            case 'problem':
                const resp = await fetch('https://eulerdao.github.io/cache.ropsten/CountProblems.json')
                const num = await resp.json();
                [...Array(num).keys()].forEach(async v => {
                    const resp = await fetch(`https://eulerdao.github.io/problems/${v}.md`)
                    const text = await resp.text();
                    const title = text.split('\n')[0].substring(2);
                    const a = document.createAttribute('a');
                    a.innerText = `Problem ${v}: ${title}`;
                    const li = document.createElement('li');
                    li.appendChild(a);
                    obj.appendChild(li);
                });
        }
    }
}

window.addEventListener('load', () => {
    window.list = new List();
    window.list.render();
})