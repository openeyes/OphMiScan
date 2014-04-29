
/* Module-specific javascript can be placed here */

$(document).ready(function() {
	$('#et_save').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			return true;
		}
		return false;
	});

	$('#et_cancel').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			if (m = window.location.href.match(/\/update\/[0-9]+/)) {
				window.location.href = window.location.href.replace('/update/','/view/');
			} else {
				window.location.href = baseUrl+'/patient/episodes/'+et_patient_id;
			}
		}
		return false;
	});

	$('#et_deleteevent').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();
			return true;
		}
		return false;
	});

	$('#et_canceldelete').unbind('click').click(function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			if (m = window.location.href.match(/\/delete\/[0-9]+/)) {
				window.location.href = window.location.href.replace('/delete/','/view/');
			} else {
				window.location.href = baseUrl+'/patient/episodes/'+et_patient_id;
			}
		} 
		return false;
	});

	$('select.populate_textarea').unbind('change').change(function() {
		if ($(this).val() != '') {
			var cLass = $(this).parent().parent().parent().attr('class').match(/Element.*/);
			var el = $('#'+cLass+'_'+$(this).attr('id'));
			var currentText = el.text();
			var newText = $(this).children('option:selected').text();

			if (currentText.length == 0) {
				el.text(ucfirst(newText));
			} else {
				el.text(currentText+', '+newText);
			}
		}
	});

	$('.thumbnail-image').click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			$(this).children('input').attr('disabled','disabled');
			$(this).closest('.column').children('select').attr('disabled','disabled');
		} else {
			$(this).addClass('selected');
			$(this).children('input').removeAttr('disabled');
			$(this).closest('.column').children('select').removeAttr('disabled');
		}
	});

	$('.btn-view').click(function(e) {
		e.preventDefault();

		var url = $(this).closest('.column').attr('data-attr-preview-link');

		new OpenEyes.UI.Dialog({
			content: '<img src="'+url+'" />',
			width: 600,
			position: 'top',
			dialogClass: 'dialog',
		}).open();
	});

	$('.pagination.edit a.page').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($(this).data('page')) - 1;

		$('.scans div.page').hide();
		$('.scans div.page[data-page="'+page+'"]').show();

		selectPage(page);
	});

	$('.pagination.edit a.next').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($('span.page:first').text());

		$('.scans div.page').hide();
		$('.scans div.page[data-page="'+page+'"]').show();

		selectPage(page);
	});

	$('.pagination.edit a.prev').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($('span.page:first').text()) - 2;

		$('.scans div.page').hide();
		$('.scans div.page[data-page="'+page+'"]').show();

		selectPage(page);
	});

	$('.pagination.view a.page').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($(this).text()) -1;

		$('.view-scan').hide();
		$('.view-scan[data-i="'+page+'"]').show();

		selectPage(page);
	});

	$('.pagination.view a.next').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($('span.page:first').text());

		$('.view-scan').hide();
		$('.view-scan[data-i="'+page+'"]').show();

		selectPage(page);
	});

	$('.pagination.view a.prev').die('click').live('click',function(e) {
		e.preventDefault();

		var page = parseInt($('span.page:first').text()) - 2;

		$('.view-scan').hide();
		$('.view-scan[data-i="'+page+'"]').show();

		selectPage(page);
	});

	$('.btn-delete').click(function(e) {
		e.preventDefault();

		$('#delete_scan_id').val($(this).parent().parent().children('div').attr('data-id'));

		new OpenEyes.UI.Dialog.Confirm({
			title: "Confirm delete scan",
			content: "<strong><p>WARNING: This will permanently delete the scanned document.</p><br/><p>Are you sure you want to proceed?</p></strong>",
			okButton: "Delete scan",
			onOk: function() {
				$.ajax({
					'type': 'POST',
					'url': baseUrl+'/OphMiScan/default/deleteScan',
					'data': "scan_id="+$('#delete_scan_id').val()+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN,
					'success': function(resp) {
						if (resp != '1') {
							alert("An internal error occurred, please try again or contact support for assistance.");
						} else {
							$('div.to-delete').append('<input type="hidden" name="ToDelete[]" value="'+$('#delete_scan_id').val()+'" />');
							$('div.scan-thumbnail-image[data-id="'+$('#delete_scan_id').val()+'"]').closest('li').remove();
						}
					}
				});
			}
		}).open();
	});

	$('img.thumbnail').load(function() {
		$(this).prev('img.thumbnail-loader').hide();
		$(this).show();

		var url = $(this).closest('.column').attr('data-attr-preview-link');

		$(this).parent().zoom({
			url: url
		});
	});

	$('#upload-file').click(function(e) {
		e.preventDefault();

		var options = {
			success: afterSuccess,
			uploadProgress: OnProgress,
			resetForm: true
		};

		$('#clinical-form').ajaxSubmit(options);
	});
});

function beforeSubmit(){
	var fsize = $('#FileInput')[0].files[0].size;
	var ftype = $('#FileInput')[0].files[0].type;

	switch(ftype) {
		case 'image/png': 
		case 'image/gif': 
		case 'image/jpeg': 
		case 'image/pjpeg':
		case 'text/plain':
		case 'text/html':
		case 'application/x-zip-compressed':
		case 'application/pdf':
		case 'application/msword':
		case 'application/vnd.ms-excel':
		case 'video/mp4':
			break;
		default:
			$("#output").html("<b>"+ftype+"</b> Unsupported file type!");
			return false
	}
		
	if (fsize >5242880) {
		alert("<b>"+fsize +"</b> Too big file! <br />File is too big, it should be less than 5 MB.");
		return false
	}
}

function afterSuccess()
{
}

function OnProgress(_event, position, total, percentComplete)
{
	$('.progress-box').show();
	$('.progress-bar').width(percentComplete + '%');
}

function selectPage(page)
{
	$('.pagination span.page').map(function() {
		$(this).replaceWith('<a href="#" class="page" data-page="'+$(this).text()+'">'+$(this).text()+'</a>');
	});

	$('a.page[data-page="'+(page+1)+'"]').replaceWith('<span class="page">'+(page+1)+'</span>');

	if ($('a.page[data-page="'+(page+2)+'"]').length >0) {
		$('span.next').replaceWith('<a href="#" class="next">next &raquo;</a>');
	} else {
		$('a.next').replaceWith('<span class="next">next &raquo;</a>');
	}

	if ($('a.page[data-page="'+(page)+'"]').length >0) {
		$('span.prev').replaceWith('<a href="#" class="prev">&laquo; back</a>');
	} else {
		$('a.prev').replaceWith('<span class="prev">&laquo; back</a>');
	}
}

function ucfirst(str) { str += ''; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); }

function eDparameterListener(_drawing) {
	if (_drawing.selectedDoodle != null) {
		// handle event
	}
}
