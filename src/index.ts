import {
    Plugin,
    Menu,
    Protyle,
    fetchSyncPost
} from "siyuan";
import "@/index.scss";

export default class PluginSample extends Plugin {

    async onload() {

        this.protyleSlash = [{
            filter: ["Embedded display html", "嵌入显示html", "qrhtml"],
            html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
            id: "insertEmoji",
            async callback(protyle: Protyle) {
                let menu =  new Menu("")
                let pdfList = await fetchSyncPost("/api/search/searchAsset",{"k":".html","exts":[]})
                for (let htmlItem of pdfList.data){
                    menu.addItem({
                        label:htmlItem.hName,
                        click:()=>{
                            protyle.protyle.toolbar.range.deleteContents()
                            protyle.insert(`<iframe sandbox="allow-forms allow-presentation allow-same-origin allow-scripts allow-modals" src="${htmlItem.path}" data-src="" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 835px; height: 413px;"></iframe>`,true);
                        }
                    })
                }
                let {x,y} = protyle.protyle.toolbar.range.getBoundingClientRect()
                menu.open({
                    x:x,
                    y:y,
                    w:1000,
                })
            }
        }];

        // 监听DOM变化，为动态添加的iframe-content元素添加全屏按钮
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach((node: Node) => {
                    if (node instanceof HTMLElement) {
                        const iframeContents = node.classList.contains('iframe-content') ? [node] : Array.from(node.querySelectorAll('.iframe-content'));
                        iframeContents.forEach(container => {
                            const containerHTMLElement = container as HTMLElement; // 类型断言
                            if (!containerHTMLElement.querySelector('.fullscreen-button')) { // 避免重复添加
                                this.addFullscreenButton(containerHTMLElement);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        console.log(this.i18n.helloPlugin);
        
    }

    // 定义添加全屏按钮函数
    addFullscreenButton(container: HTMLElement) {
        const fullscreenBtn = document.createElement('div');
        fullscreenBtn.textContent = '全屏（ESC退出）';
        fullscreenBtn.classList.add('fullscreen-button');
        fullscreenBtn.style.position = 'absolute';
        fullscreenBtn.style.top = '0';
        fullscreenBtn.style.right = '0';
        fullscreenBtn.style.zIndex = '10';
        fullscreenBtn.style.backgroundColor = '#f00';
        fullscreenBtn.style.color = '#fff';
        fullscreenBtn.style.padding = '5px';
        fullscreenBtn.style.cursor = 'pointer';
        fullscreenBtn.style.opacity = '0'; // 初始不可见
        fullscreenBtn.style.transition = 'opacity 0.5s'; // 平滑过渡效果
        
        fullscreenBtn.addEventListener('click', () => {
            const iframe = container.querySelector('iframe');
            if (iframe) {
                this.requestFullscreen(iframe);
            }
        });

        // 当鼠标移到容器上时显示按钮
        container.addEventListener('mouseenter', () => {
            fullscreenBtn.style.opacity = '1';
        });

        // 当鼠标离开容器时隐藏按钮
        container.addEventListener('mouseleave', () => {
            fullscreenBtn.style.opacity = '0';
        });

        container.appendChild(fullscreenBtn);
    }


    // 定义请求全屏函数
    requestFullscreen(element: Element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
            (element as any).mozRequestFullScreen();
        } else if ((element as any).webkitRequestFullscreen) {
            (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
            (element as any).msRequestFullscreen();
        }
    }
}