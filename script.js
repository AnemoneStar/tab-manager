$(function(){
    function updateTabList() {
        chrome.windows.getCurrent({populate: true}, window => {
            console.log(window)
            $("#tabs").html("")
            window.tabs.forEach(function(tab){
                var li = document.createElement("li")
                var favicon_img = document.createElement("img")
                var name_span = document.createElement("span")
                var domain_span = document.createElement("span")
                var close_button = document.createElement("span")
                li.style.position = "relative"
                li.dataset.isNewTab = tab.url == "chrome://newtab/"
                li.dataset.isGoogleSearch = /[htps]+:\/\/[a-z.]+\.google[.a-z]+\/search/.test(tab.url)
                if(tab.favIconUrl) favicon_img.src = tab.favIconUrl
                favicon_img.style.height = "16px"
                favicon_img.style.width = "16px"
                favicon_img.style.marginRight = "0.5em"
                name_span.innerText = tab.title
                domain_span.innerText = (new URL(tab.url)).hostname
                domain_span.style.marginLeft = "1em"
                domain_span.style.color = "#888"
                close_button.className = "glyphicon "+(tab.pinned ? "glyphicon-pushpin" : "glyphicon-remove")
                close_button.style.position = "absolute"
                close_button.style.left = "-40px"
                close_button.style.top = "2px"
                close_button.style.fontSize = "16px"
                close_button.onclick = function(){
                    li.style.display = "none"
                    chrome.tabs.remove(tab.id,updateTabList)
                }
                li.appendChild(favicon_img)
                li.appendChild(name_span)
                li.appendChild(domain_span)
                li.appendChild(close_button)
                $("#tabs").append(li)
            })
        })
    }
    updateTabList()
    $("#newtab-all-close").click(function(){
        $('li[data-is-new-tab="true"] .glyphicon-remove').click()
    })
    $("#google-search-all-close").click(function(){
        $('li[data-is-google-search="true"] .glyphicon-remove').click()
    })
    var chromeTabEvents = [
        "onCreated",
        "onUpdated",
        "onMoved",
        "onDetached",
        "onAttached",
        "onRemoved",
        "onReplaced"
    ]
    chromeTabEvents.forEach(function (eventName) {
        chrome.tabs[eventName].addListener(updateTabList)
    })
})