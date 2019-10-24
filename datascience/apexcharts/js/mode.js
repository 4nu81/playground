if (window.matchMedia('(prefers-color-scheme)').media === 'not all'){
    document.documentElement.style.display = 'none';
    console.log('prefered-color-scheme setted');
    document.head.insertAdjacentHTML(
        'beforeend',
        '<link rel="stylesheet" href="css/dark.css" onload="document.documentElement.style.display = ``">'
    );
}