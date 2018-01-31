var actionRedirect;

$(document).ready(function () {

    $('#save').on('click', function () {
        saveData('Clients');
    });

});


function saveData(controller, action) {
    utils.ui.showSpinner();
    if (isDirty) {
        actionRedirect = action == undefined ? 'index' : action;
        utils.form.saveData('Clients', null, 'Main', redirectToUrl);
    }
    else {
        if ($('#Id').val() != 0) {
            var url = action == undefined ? '/' + controller + '/index' : '/' + controller + '/' + action + '/' + $('#Id').val();
            location.href = url;
        } else {
            var validator = $("form").validate();
            validator.form();
            utils.notification.showWarning();
            utils.ui.hideSpinner();
        }
    }
}

function redirectToUrl(id) {
    location.href = '/Clients/' + actionRedirect + '/' + id + '?SuccessMessage=Successful operation.';
}