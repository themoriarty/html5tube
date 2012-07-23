function getSrc(o){
    if (o.src)
	return o.src;
    if (o.data)
	return o.data;
    return "";
};

function getSource(e){
    var src = getSrc(e);
    if (src.search("http://www.youtube.com/v/") == 0 || src.search("http://youtube.com/v/") == 0)
	return "youtube";
    if (src.search("http://www.kino-govno.com/") == 0)
	return "kino-govno";
    if (src.search("http://video.ted.com/") == 0)
	return "ted.com";
    if (src.search("http://vimeo.com/moogaloop.swf") == 0)
	return "vimeo";
    return undefined;
};

function srcVideo(source, e){
    switch (source){
    case "youtube": return getSrc(e).replace(/youtube.com\/v\/([^\?&]+)([^\"\']*)/, "youtube.com/embed/$1");
    case "kino-govno": return getQueryVariable(e.getAttribute("flashvars"), "file");
    case "ted.com": return getQueryVariable(e.getAttribute("flashvars"), "vu");
    case "vimeo": return "//vimeo.com/play_redirect?clip_id=" + getQueryVariable(getSrc(e), "clip_id") + "&codecs=H264";
    }
};
function createVideo(source, e){
    switch(source){
    case "youtube":
	var newVideo = document.createElement("iframe");
	newVideo.frameBorder = 0;
	newVideo.height = e.height;
	newVideo.width = e.width;
	newVideo.src = srcVideo(source, e);
	return newVideo;
    case "kino-govno":
    case "ted.com":
    case "vimeo":
	var newVideo = document.createElement("video");
	newVideo.controls = "1";
	newVideo.height = e.height;
	newVideo.width = e.width;
	newVideo.src = srcVideo(source, e);
	return newVideo;
    }
};
function srcLink(source, e){
    switch (source){
    case "youtube": return getSrc(e).replace("?", "&").replace("youtube.com/v/", "youtube.com/watch?v=");
    case "kino-govno": return getQueryVariable(e.getAttribute("flashvars"), "link");
    case "ted.com": return "http://video.ted.com/"; //XXX
    };
};

function getQueryVariable(query, variable) {
    var vars = query.split("?");
    if (vars.length > 1)
	vars = vars[1];
    else
	vars = vars[0];
    var vars = vars.split("&");
    for (var i = 0; i < vars.length; i++) {
	var pair = vars[i].split("=");
	if (pair[0] == variable) {
	    return unescape(pair[1]);
	}
    }
};

function doReplace(embeds){
    for (var i = 0; i < embeds.length; ++i){
	var e = embeds[i];
	var source = getSource(e);
	if (/*e.type == "application/x-shockwave-flash" //maybe too strong?
	      &&*/ source)
	    {
		var newVideo = createVideo(source, e);
		var newHTML = newVideo.outerHTML;
		var link = srcLink(source, e);
		if (link){
		    var newLink = document.createElement("a");
		    newLink.innerHTML = "*";
		    newLink.href = link;
		    newLink.target = "_blank";
		    newHTML += newLink.outerHTML;
		}
		//OMG
		if (e.parentNode.tagName == "OBJECT"){
		    e.parentNode.outerHTML = newHTML;
		    --i;
		} else{
		    e.outerHTML = newHTML;
		}
	    }
    }};
doReplace(document.getElementsByTagName("embed"));
doReplace(document.getElementsByTagName("object"));
