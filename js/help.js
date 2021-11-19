class Help{
    static HOST = '/';
    
    constructor() {
    }

    /**
     * 加载JS
     * @param {*} url 
     * @param {*} fun 
     */
    static includeJs( url, fun ){
        if( 'string' === typeof url ) url = [url];
        url.map( ( item, index ) => {
            let ele = document.createElement("script");
            ele.src = item + `?&versionRandom=${ new Date().getTime() + index }`;
            ele.defer = 'async';
            document.querySelector('html').appendChild( ele );
            if( ++index === url.length ) window.onload = () => { fun && fun() }
        })
        
    }

    /**
     * 载入单个Css
     * @param {*} url 
     */
    static includeCss( url ){
        if( 'string' === typeof url ) url = [url];
        url.map( ( item, index ) => {
            let ele = document.createElement("link");
            ele.rel = "stylesheet";
            ele.href = item + `?&versionRandom=${ new Date().getTime() + index }`;
            document.head.appendChild( ele );
        })
        
    }
}

