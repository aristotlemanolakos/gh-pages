
var $storage_manager;
var $quota_exceeded_window;
var ignoring_quota_exceeded = false;

function storage_quota_exceeded(){
	if($quota_exceeded_window){
		$quota_exceeded_window.close();
		$quota_exceeded_window = null;
	}
	if(ignoring_quota_exceeded){
		return;
	}
	var $w = $FormWindow().title("Storage Error").addClass("jspaint-dialogue-window");
	$w.$main.html(
		"<p>JS Paint stores images as you work on them so that if you " +
		"close your browser or tab or reload the page " +
		"your images are usually safe.</p>" +
		"<p>However, it has run out of space to do so.</p>" +
		"<p>You can still save the current image with <b>File > Save</b>. " +
		"You should save frequently, or free up enough space to keep the image safe.</p>"
	);
	$w.$Button("View and manage storage", function(){
		$w.close();
		ignoring_quota_exceeded = false;
		manage_storage();
	});
	$w.$Button("Ignore", function(){
		$w.close();
		ignoring_quota_exceeded = true;
	});
	$w.width(500);
	$w.center();
	$quota_exceeded_window = $w;
}

function manage_storage(){
	if($storage_manager){
		$storage_manager.close();
	}
	$storage_manager = $Window().title("Manage Storage").addClass("storage-manager");
	// @TODO: remove all button (with confirmation)
	// @TODO: move this text to the bottom?
	$storage_manager.$content.html(
		"<p>Any images you've saved to your computer with <b>File > Save</b> will not be affected.</p>"
	);
	var $table = $(E("table")).appendTo($storage_manager.$content);
	
	var addRowFor = function(k, imgSrc){
		var $tr = $(E("tr")).appendTo($table);
		
		var $img = $(E("img")).attr({src: imgSrc});
		var $remove = $(E("button")).addClass("jspaint-button jspaint-dialogue-button").text("Remove");
		var $a = $(E("a")).attr({href: "#" + k.replace("image#", "local:"), target: "__blank"}).text(k.replace("image#", "local:"));
		
		$(E("td")).append($a).appendTo($tr);
		$(E("td")).append($img).appendTo($tr);
		$(E("td")).append($remove).appendTo($tr);
		
		$remove.click(function(){
			localStorage.removeItem(k);
			$tr.remove();
		});
	};
	
	for(var k in localStorage){
		if(k.match(/^image#/)){
			var v = localStorage[k];
			addRowFor(k, v[0] === '"' ? JSON.parse(v) : v);
		}
	}
	$storage_manager.width(500);
	$storage_manager.center();
}
