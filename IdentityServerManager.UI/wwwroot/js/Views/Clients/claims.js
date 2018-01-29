
$(document).ready(function () {

    $('#save').on('click', function () {
        saveData('Clients');
    });

});


function saveData(controller, action) {
    utils.ui.showSpinner();
    var url = action != undefined ? '/' + controller + '/' + action + '/' + $('#Id').val() : '/' + controller + '/index';
    if (isDirty) {
        utils.form.saveData('Clients', null, 'Claims', url);
    }
    else {
        if ($('#Id').val() != 0) {
            location.href = url;
        } else {
            var validator = $("form").validate();
            validator.form();
            utils.notification.showWarning();
            utils.ui.hideSpinner();
        }
    }
}